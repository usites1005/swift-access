import { FilterQuery } from 'mongoose';
import { Request } from 'express';
import AdminModel from '../models/Admin';
import { IAdmin } from '../types/admin';
import BcryptService from './bcrypt';

export default class ADMINService {
	/* CREATE NEW ADMIN */
	static async create(data: IAdmin) {
		const { email, username } = data;

		// check if user already exists
		const existingUser = await AdminModel.findOne({
			$or: [{ email }, { username }],
		});

		if (existingUser) {
			throw new Error('Email or username is already in use');
		}

		const newUser = new AdminModel(data);
		await newUser.save();
		return newUser;
	}

	/* LOGIN ADMIN */
	static async login(email: string, password: string) {
		const user = await AdminModel.findOne({
			email,
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
		const user = await AdminModel.findOne({
			email,
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

	/* GET SINGLE ADMIN */
	static async getAdmin(data: Partial<IAdmin>) {
		return AdminModel.findOne({ ...data } as FilterQuery<IAdmin>);
	}

	/* GET ALL ADMINS */
	static async getAdmins(req: Request) {
		const data: Partial<IAdmin> = req.body;
		return AdminModel.find({ ...data } as FilterQuery<IAdmin>).sort({
			createdAt: -1,
		});
	}

	static async updateAdmin({ id, ...data }: Partial<IAdmin>) {
		return AdminModel.findByIdAndUpdate(
			id,
			{
				$set: {
					...data,
				},
			},
			{ new: true }
		);
	}
}
