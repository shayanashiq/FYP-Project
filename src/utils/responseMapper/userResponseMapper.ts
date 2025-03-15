// utils/userResponseMapper.ts
import { UserRole } from "@prisma/client";

export function loginResponseDto(currUser: any, role: UserRole) {
  return {
    id: currUser.id,
    email: currUser.email,
    role: currUser.role,
    createdAt: currUser.createdAt, 
    updatedAt: currUser.updatedAt,
    verified: currUser.verified, 
    resetToken: currUser.resetToken, 
    resetTokenExpires: currUser.resetTokenExpires, 
    isPasswordSet: currUser.isPasswordSet, 
    isProfileComplete: currUser.isProfileComplete, 
    loginType: currUser.loginType, 
    isAvailable: currUser.isAvailable,
    patientProfile:
      role === UserRole.PATIENT && currUser.patientProfile
        ? {
            id: currUser.patientProfile.id,
            firstName: currUser.patientProfile.firstName,
            lastName: currUser.patientProfile.lastName,
            dob: currUser.patientProfile.dob,
            imageUrl: currUser.patientProfile.imageUrl, 
            allergies: currUser.patientProfile.allergies,
            smokeOrVape: currUser.patientProfile.smokeOrVape,
            consumeAlcohol: currUser.patientProfile.consumeAlcohol,
            sleepRating: currUser.patientProfile.sleepRating,
            bloodType: currUser.patientProfile.bloodType,
            gender: currUser.patientProfile.gender,
            fitnessRating: currUser.patientProfile.fitnessRating,
            isMedication: currUser.patientProfile.isMedication,
            weight: currUser.patientProfile.weight,
            height: currUser.patientProfile.height, 
            existingMedicalCondition:
              currUser.patientProfile.existingMedicalCondition,
            medicalCondition: currUser.patientProfile.medicalCondition,
            medicationItems: currUser.patientProfile.medicationItems,
            residence: currUser.patientProfile.residence
          }
        : undefined,
      patientDoctors:
      role === UserRole.PATIENT && currUser.patientProfile
        ? {
            profile: currUser.patientDoctors
          }
        : undefined,
    doctorProfile:
      role === UserRole.DOCTOR && currUser.doctorProfile
        ? {
            id: currUser.doctorProfile.id,
            firstName: currUser.doctorProfile.firstName,
            lastName: currUser.doctorProfile.lastName,
            number: currUser.doctorProfile.number,
            spso: currUser.doctorProfile.spso,
            imageUrl: currUser.doctorProfile.imageUrl,
            specialization: currUser.doctorProfile.specialization,
          }
        : undefined,
    patientDoctor:
      role === UserRole.PATIENT && currUser.patientDoctors.lenght>0
        ? {
            id: currUser.patientDoctors[0].doctor.id,
            email: currUser.patientDoctors[0].doctor.email,
            role: currUser.patientDoctors[0].doctor.role,
            createdAt: currUser.patientDoctors[0].doctor.createdAt, 
            updatedAt: currUser.patientDoctors[0].doctor.updatedAt, 
            verified: currUser.patientDoctors[0].doctor.verified, 
            resetToken: currUser.patientDoctors[0].doctor.resetToken, 
            resetTokenExpires: currUser.patientDoctors[0].doctor.resetTokenExpires, 
            isPasswordSet: currUser.patientDoctors[0].doctor.isPasswordSet, 
            isProfileComplete: currUser.patientDoctors[0].doctor.isProfileComplete, 
            loginType: currUser.patientDoctors[0].doctor.loginType,
            doctorProfile: {
              id: currUser.patientDoctors[0].doctor.doctorProfile.id,
              firstName:
                currUser.patientDoctors[0].doctor.doctorProfile.firstName,
              lastName:
                currUser.patientDoctors[0].doctor.doctorProfile.lastName,
              specialization:
                currUser.patientDoctors[0].doctor.doctorProfile.specialization,
              number: currUser.patientDoctors[0].doctor.doctorProfile.number,
              spso: currUser.patientDoctors[0].doctor.doctorProfile.spso,
              imageUrl:
                currUser.patientDoctors[0].doctor.doctorProfile.imageUrl,
            },
          }
        : undefined,
  };
}
