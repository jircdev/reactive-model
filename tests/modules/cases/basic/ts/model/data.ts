type User = {
	id: number;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	age: number;
	isActive: boolean;
	createdAt: Date;
};

export const HARDCODED_ITEMS: User[] = [
	{
		id: 1,
		username: 'johnDoe',
		email: 'john.doe@example.com',
		firstName: 'John',
		lastName: 'Doe',
		age: 30,
		isActive: true,
		createdAt: new Date('2023-01-15'),
	},
	{
		id: 2,
		username: 'janeSmith',
		email: 'jane.smith@example.com',
		firstName: 'Jane',
		lastName: 'Smith',
		age: 28,
		isActive: false,
		createdAt: new Date('2023-02-20'),
	},
	{
		id: 3,
		username: 'alexJohnson',
		email: 'alex.johnson@example.com',
		firstName: 'Alex',
		lastName: 'Johnson',
		age: 35,
		isActive: true,
		createdAt: new Date('2023-03-05'),
	},
];
