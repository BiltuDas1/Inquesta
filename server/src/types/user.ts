type userWithLastName = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

type userWithoutLastName = {
  firstname: string;
  email: string;
  password: string;
};

export type User = userWithLastName | userWithoutLastName;
