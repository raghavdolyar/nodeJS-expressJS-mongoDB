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
	body('email')
		.trim()
		.toLowerCase()
		.notEmpty()
		.withMessage('Email is required.')
		.isEmail()
		.withMessage('Please enter a valid email address.'),
	body('password').notEmpty().withMessage('Password is required.'),

	async (req, res, next) => {
		const { email, password } = req.body;
		const errors = validationResult(req);
		const oldInput = { email };

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

			// search guests first, then hosts
			let user = await Guest.findOne({ email });
			let user_type = 'guest';

			if (!user) {
				user = await Host.findOne({ email });
				user_type = 'host';
			}

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
