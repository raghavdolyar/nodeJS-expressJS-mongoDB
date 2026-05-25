const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const NAME_REGEX = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		pageTitle: 'login',
		currentPage: 'login',
		isLoggedIn: req.session.isLoggedIn,
	});
};

exports.getSignup = (req, res, next) => {
	res.render('auth/signup', {
		pageTitle: 'signup',
		currentPage: 'signup',
		isLoggedIn: req.session.isLoggedIn,
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
		.notEmpty()
		.withMessage('Email is required.')
		.isEmail()
		.withMessage('Please enter a valid email address.')
		.normalizeEmail(),
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
	body('terms')
		.equals('accepted')
		.withMessage('You must accept the terms and conditions.'),
	// final handler middleware
	async (req, res, next) => {
		const { firstName, lastName, email, password, userType } = req.body;
		const errors = validationResult(req);

		const oldInput = {
			firstName,
			lastName,
			email,
			userType,
		};

		if (!errors.isEmpty()) {
			return res.status(422).render('auth/signup', {
				pageTitle: 'signup',
				currentPage: 'signup',
				isLoggedIn: req.session.isLoggedIn,
				oldInput,
				validationErrors: errors.array(),
			});
		}

		try {
			const hashedPassword = await bcrypt.hash(password, 12);

			const user = new User({
				first_name: firstName,
				last_name: lastName || undefined,
				email,
				password: hashedPassword,
				user_type: userType,
			});

			await user.save();
			return res.redirect('/login');
		} catch (err) {
			console.error(err);
			next(err);
		}
	},
];

exports.postLogin = (req, res, next) => {
	req.session.isLoggedIn = true;
	res.redirect('/');
};

exports.postLogout = async (req, res, next) => {
	try {
		await new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
		res.clearCookie('connect.sid');
		res.redirect('/');
	} catch (err) {
		next(err);
	}
};
