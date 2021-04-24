import { FilterQuery } from 'mongoose';
import UserModel from '../models/User';
import { IUser } from '../types/user';
import BcryptService from './bcrypt';

export default class UserService {
	/* CREATE NEW USER */
	static async create(data: IUser) {
		const { email, username } = data;

		// check if user already exists
		const existingUser = await UserModel.findOne({
			$or: [{ email }, { username }],
			deleted: false,
		});

		if (existingUser) {
			throw new Error('Email or username is already in use');
    }
    // todo move this hash to the user model file
		const hashAnswer = BcryptService.hashPassword(data.sAnswer);
		data.sAnswer = hashAnswer;
		const newUser = new UserModel(data);

		await newUser.save();
		return newUser;
	}

	/* LOGIN USER */
	static async login(email: string, password: string) {
		const user = await UserModel.findOne({
			email,
			isVerified: true,
			deleted: false,
		});

		if (!user) {
			return null;
		}

		const passwordMatch = BcryptService.comparePassword(
			password,
			user.password
    );    

		if (!passwordMatch) {
			return null;
		}

		return user;
	}

	/* CHANGE PASSWORD */
	static async changePassword(
		email: string,
		oldPassword: string,
		newPassword: string
	) {
		const user = await UserModel.findOne({
			email,
			isVerified: true,
			deleted: false,
		});

		if (!user) {
			return null;
		}

		const passwordMatch = BcryptService.comparePassword(
			oldPassword,
			user.password
		);

		if (!passwordMatch) {
			return null;
		}

		user.password = newPassword;
		await user.save();
		return user;
	}

	/* GET SINGLE USER */
	static async getUser(data: Partial<IUser>) {
		return UserModel.findOne({
			deleted: false,
			...data,
		} as FilterQuery<IUser>);
	}

	/* GET ALL USERS */
	static async getUsers(data: {}) {
		return UserModel.find({ deleted: false, ...data }).sort({ createdAt: -1 });
	}

	static async updateUser({ id, ...data }: Partial<IUser>) {
		const user = await UserModel.findByIdAndUpdate(
			id,
			{
				$set: {
					...data,
				},
			},
			{ new: true }
		);
		return user;
	}

	static async queryUser(query: { [key: string]: any }) {
		const user = await UserModel.find({
			...query,
			deleted: false,
		}).countDocuments();
		return user;
	}
}
