export type User = {
    fullName:string;
    email:string;
    image:string;
   
}

// these all the props that the CustomJwtSessionClaims will inhirte them from the User

// This setup allows you to use
//  CustomJwtSessionClaims in your
//  application with the assurance 
// that it includes all the necessary
//  user properties defined in the User type.
