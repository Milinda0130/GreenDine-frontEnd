import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Phone, Calendar, User as UserIcon } from 'lucide-react';
import { SignupRequest } from '../../services/api';

export const Signup: React.FC = () => {
	const [form, setForm] = useState<SignupRequest>({
		fullname: '',
		username: '',
		email: '',
		phoneNumber: '',
		dateOfBirth: '',
		password: '',
		confirmPassword: '',
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [error, setError] = useState<string>('');
	const [success, setSuccess] = useState<string>('');
	const { register, isLoading } = useAuth();
	const navigate = useNavigate();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSuccess('');
		
		if (form.password !== form.confirmPassword) {
			setError('Passwords do not match');
			return;
		}
		
		const success = await register(form);
		if (success) {
			setSuccess('Registration successful! Please login.');
			setForm({
				fullname: '',
				username: '',
				email: '',
				phoneNumber: '',
				dateOfBirth: '',
				password: '',
				confirmPassword: '',
			});
			// Navigate to login after successful registration
			setTimeout(() => navigate('/login'), 2000);
		} else {
			setError('Registration failed. Email may already be in use.');
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<div className="mx-auto h-12 w-12 bg-green-600 rounded-full flex items-center justify-center">
						<User className="h-6 w-6 text-white" />
					</div>
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
						Create your account
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Or{' '}
						<Link
							to="/login"
							className="font-medium text-green-600 hover:text-green-500 transition-colors"
						>
							sign in to your account
						</Link>
					</p>
				</div>

				<div className="bg-white py-8 px-6 shadow-lg rounded-xl">
					<form className="space-y-6" onSubmit={handleSubmit}>
						{error && (
							<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
								{error}
							</div>
						)}
						{success && (
							<div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
								{success}
							</div>
						)}

						<div>
							<label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-2">
								Full Name
							</label>
							<div className="relative">
								<UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
								<input
									id="fullname"
									name="fullname"
									type="text"
									required
									value={form.fullname}
									onChange={handleChange}
									className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
									placeholder="Enter your full name"
								/>
							</div>
						</div>

						<div>
							<label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
								Username
							</label>
							<div className="relative">
								<UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
								<input
									id="username"
									name="username"
									type="text"
									required
									value={form.username}
									onChange={handleChange}
									className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
									placeholder="Enter your username"
								/>
							</div>
						</div>

						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
								Email Address
							</label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
									value={form.email}
									onChange={handleChange}
									className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
									placeholder="Enter your email"
								/>
							</div>
						</div>

						<div>
							<label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
								Phone Number
							</label>
							<div className="relative">
								<Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
								<input
									id="phoneNumber"
									name="phoneNumber"
									type="tel"
									required
									value={form.phoneNumber}
									onChange={handleChange}
									className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
									placeholder="Enter your phone number"
								/>
							</div>
						</div>

						<div>
							<label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
								Date of Birth
							</label>
							<div className="relative">
								<Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
								<input
									id="dateOfBirth"
									name="dateOfBirth"
									type="date"
									required
									value={form.dateOfBirth}
									onChange={handleChange}
									className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
								/>
							</div>
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
								Password
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
								<input
									id="password"
									name="password"
									type={showPassword ? 'text' : 'password'}
									autoComplete="new-password"
									required
									value={form.password}
									onChange={handleChange}
									className="pl-10 pr-10 block w-full border border-gray-300 rounded-lg py-3 px-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
									placeholder="Enter your password"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
								>
									{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
								</button>
							</div>
						</div>

						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
								Confirm Password
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
								<input
									id="confirmPassword"
									name="confirmPassword"
									type={showConfirmPassword ? 'text' : 'password'}
									autoComplete="new-password"
									required
									value={form.confirmPassword}
									onChange={handleChange}
									className="pl-10 pr-10 block w-full border border-gray-300 rounded-lg py-3 px-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
									placeholder="Confirm your password"
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
								>
									{showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
								</button>
							</div>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
						>
							{isLoading ? 'Creating account...' : 'Create account'}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Signup;
