// import { UserRole } from "@prisma/client";

// export function loginResponseDto(currUser: any, role: UserRole) {
export function loginResponseDto(currUser: any) {
  return {
    id: currUser.id,
    email: currUser.email,
    role: currUser.role,
    isAdmin: currUser.isAdmin,
    verified: currUser.verified,
    isPasswordSet: currUser.isPasswordSet,
    createdAt: currUser.createdAt,
    updatedAt: currUser.updatedAt,
    
    customerProfile:
      // role === UserRole.CUSTOMER && currUser.customerProfile
        // ?
         {
            id: currUser.customerProfile.id,
            firstName: currUser.customerProfile.firstName,
            lastName: currUser.customerProfile.lastName,
            phone: currUser.customerProfile.phone,
            address: currUser.customerProfile.address,
            city: currUser.customerProfile.city,
            country: currUser.customerProfile.country,
            zipCode: currUser.customerProfile.zipCode,
          }
        // : undefined
  };
}