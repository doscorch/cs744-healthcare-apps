const User_Type_Admin = 1;
const User_Type_Patient = 2;
const User_Type_Physician = 3;
const User_Type_Staff_Member = 4;
export const UserType = {
    Admin: User_Type_Admin,
    Patient: User_Type_Patient,
    Physician: User_Type_Physician,
    StaffMember: User_Type_Staff_Member,

    GetTranslation: (type) => {
        switch (type) {
            case User_Type_Admin: return "admin";
            case User_Type_Patient: return "patient";
            case User_Type_Physician: return "physician";
            case User_Type_Staff_Member: return "staff member";
        }
    }
};

const User_Status_Active = 1;
const User_Status_Inactive = 2;
const User_Status_Disabled = 3;
export const UserStatus = {
    Active: User_Status_Active,
    Inactive: User_Status_Inactive,
    Disabled: User_Status_Disabled,

    GetTranslation: (type) => {
        switch (type) {
            case User_Status_Active: return "active";
            case User_Status_Inactive: return "disabled";
            case User_Status_Disabled: return "blocked";
        }
    }
};

