const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Guest = require('../models/guest');
const Host = require('../models/host');

const NAME_REGEX = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
const PHONE_REGEX = /^[+]?[\d\s\-().]{7,20}$/;

exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		pageTitle: 'login',
		currentPage: 'login',
		oldInput: {},
		validationErrors: [],
	});
};

exports.getSignup = (req, res, next) => {
	res.render('auth/signup', {
		pageTitle: 'signup',
		currentPage: 'signup',
		oldInput: {},
		validationErrors: [],
	});
};

exports.postSignup = [
	body('firstName')
		.trim()
		.notEmpty()
		.withMessage('First name is required.')
		.isLength({ min: 2, max: 50 })
		.withMessage('First name must be between 2 and 50 characters.')
		.matches(NAME_REGEX)
		.withMessage(
			'First name may only contain letters, spaces, hyphens, and apostrophes.',
		),
	body('lastName')
		.optional({ values: 'falsy' })
		.trim()
		.isLength({ min: 2, max: 50 })
		.withMessage('Last name must be between 2 and 50 characters.')
		.matches(NAME_REGEX)
		.withMessage(
			'Last name may only contain letters, spaces, hyphens, and apostrophes.',
		),
	body('email')
		.trim()
		.toLowerCase()
		.notEmpty()
		.withMessage('Email is required.')
		.isEmail()
		.withMessage('Please enter a valid email address.'),
	body('password')
		.notEmpty()
		.withMessage('Password is required.')
		.matches(PASSWORD_REGEX)
		.withMessage(
			'Password must be at least 8 characters and include one lowercase letter, one uppercase letter, and one special character.',
		),
	body('confirmPassword')
		.notEmpty()
		.withMessage('Please confirm your password.')
		.custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error('Passwords do not match.');
			}
			return true;
		}),
	body('userType')
		.notEmpty()
		.withMessage('Please select an account type.')
		.isIn(['guest', 'host'])
		.withMessage('Account type must be either guest or host.'),
	// phone is only required when signing up as a host
	body('phone')
		.if(body('userType').equals('host'))
		.trim()
		.notEmpty()
		.withMessage('Phone number is required for hosts.')
		.matches(PHONE_REGEX)
		.withMessage('Please enter a valid phone number.'),
	body('terms')
		.equals('accepted')
		.withMessage('You must accept the terms and conditions.'),

	async (req, res, next) => {
		const { firstName, lastName, email, password, userType, phone } = req.body;
		const errors = validationResult(req);

		const oldInput = { firstName, lastName, email, userType, phone };

		if (!errors.isEmpty()) {
			return res.status(422).render('auth/signup', {
				pageTitle: 'signup',
				currentPage: 'signup',
				oldInput,
				validationErrors: errors.array(),
			});
		}

		try {
			const hashedPassword = await bcrypt.hash(password, 12);

			if (userType === 'host') {
				await Host.create({
					first_name: firstName,
					last_name: lastName || '',
					email,
					password: hashedPassword,
					phone: phone.trim(),
				});
			} else {
				await Guest.create({
					first_name: firstName,
					last_name: lastName || '',
					email,
					password: hashedPassword,
				});
			}

			return res.redirect('/login');
		} catch (err) {
			console.error(err);
			next(err);
		}
	},
];

exports.postLogin = [
	body('loginType')
		.notEmpty()
		.withMessage('Please select whether you are a guest or host.')
		.isIn(['guest', 'host'])
		.withMessage('Account type must be either guest or host.'),
	body('email')
		.trim()
		.toLowerCase()
		.notEmpty()
		.withMessage('Email is required.')
		.isEmail()
		.withMessage('Please enter a valid email address.'),
	body('password').notEmpty().withMessage('Password is required.'),

	async (req, res, next) => {
		const { email, password, loginType } = req.body;
		const errors = validationResult(req);
		const oldInput = { email, loginType };

		if (!errors.isEmpty()) {
			return res.status(422).render('auth/login', {
				pageTitle: 'login',
				currentPage: 'login',
				oldInput,
				validationErrors: errors.array(),
			});
		}

		try {
			const invalidLogin = { path: 'email', msg: 'Invalid email or password.' };

			// query only the collection the user selected
			const Model = loginType === 'host' ? Host : Guest;
			const user = await Model.findOne({ email });
			const user_type = loginType;

			if (!user) {
				return res.status(422).render('auth/login', {
					pageTitle: 'login',
					currentPage: 'login',
					oldInput,
					validationErrors: [invalidLogin],
				});
			}

			const passwordMatch = await bcrypt.compare(password, user.password);

			if (!passwordMatch) {
				return res.status(422).render('auth/login', {
					pageTitle: 'login',
					currentPage: 'login',
					oldInput,
					validationErrors: [invalidLogin],
				});
			}

			req.session.isLoggedIn = true;

			req.session.user = {
				_id: user._id.toString(),
				user_type, // 'guest' or 'host'
				first_name: user.first_name,
				last_name: user.last_name,
			};

			await new Promise((resolve, reject) => {
				req.session.save(err => (err ? reject(err) : resolve()));
			});

			return res.redirect('/');
		} catch (err) {
			console.error(err);
			next(err);
		}
	},
];

exports.postLogout = async (req, res, next) => {
	try {
		await new Promise((resolve, reject) => {
			req.session.destroy(err => (err ? reject(err) : resolve()));
		});
		res.clearCookie('connect.sid');
		res.redirect('/');
	} catch (err) {
		next(err);
	}
};

exports.getEditProfile = async (req, res, next) => {
	try {
		const Model = req.session.user.user_type === 'host' ? Host : Guest;
		const user = await Model.findById(req.session.user._id);

		if (!user) {
			console.log('user not found');
			return res.redirect('/signup');
		}

		res.render('auth/edit-profile', {
			pageTitle: 'edit profile',
			currentPage: 'profile',
			oldInput: {
				firstName: user.first_name,
				lastName: user.last_name,
				email: user.email,
				phone: user.phone || '',
			},
			validationErrors: [],
		});
	} catch (err) {
		next(err);
	}
};

exports.postEditProfile = [
	body('firstName')
		.trim()
		.notEmpty()
		.withMessage('First name is required.')
		.isLength({ min: 2, max: 50 })
		.withMessage('First name must be between 2 and 50 characters.')
		.matches(NAME_REGEX)
		.withMessage(
			'First name may only contain letters, spaces, hyphens, and apostrophes.',
		),
	body('lastName')
		.optional({ values: 'falsy' })
		.trim()
		.isLength({ min: 2, max: 50 })
		.withMessage('Last name must be between 2 and 50 characters.')
		.matches(NAME_REGEX)
		.withMessage(
			'Last name may only contain letters, spaces, hyphens, and apostrophes.',
		),
	body('phone')
		.if(
			(value, { req }) =>
				req.session.user && req.session.user.user_type === 'host',
		)
		.trim()
		.notEmpty()
		.withMessage('Phone number is required for hosts.')
		.matches(PHONE_REGEX)
		.withMessage('Please enter a valid phone number.'),

	async (req, res, next) => {
		const { firstName, lastName, phone } = req.body;
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(422).render('auth/edit-profile', {
				pageTitle: 'Edit Profile',
				currentPage: 'profile',
				oldInput: { firstName, lastName, email: req.session.user.email, phone },
				validationErrors: errors.array(),
			});
		}

		try {
			const Model = req.session.user.user_type === 'host' ? Host : Guest;
			const updateData = { first_name: firstName, last_name: lastName || '' };
			if (req.session.user.user_type === 'host') {
				updateData.phone = phone;
			}

			await Model.findByIdAndUpdate(req.session.user._id, updateData);

			req.session.user.first_name = firstName;
			req.session.user.last_name = lastName || '';

			await new Promise((resolve, reject) => {
				req.session.save(err => (err ? reject(err) : resolve()));
			});

			res.redirect('/');
		} catch (err) {
			console.error(err);
			next(err);
		}
	},
];

exports.getDeleteProfile = (req, res, next) => {
	res.render('auth/delete-profile', {
		pageTitle: 'delete account',
		currentPage: 'profile',
	});
};

exports.postDeleteProfile = async (req, res, next) => {
	try {
		const Model = req.session.user.user_type === 'host' ? Host : Guest;

		// findOneAndDelete triggers hooks that delete related bookings/homes
		await Model.findOneAndDelete({ _id: req.session.user._id });

		await new Promise((resolve, reject) => {
			req.session.destroy(err => (err ? reject(err) : resolve()));
		});

		res.clearCookie('connect.sid');
		
		res.redirect('/');
	} catch (err) {
		next(err);
	}
};
