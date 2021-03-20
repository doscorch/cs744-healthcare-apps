const User_Type_Admin = 1;
const User_Type_Pharmacist = 2;
export const UserType = {
    Admin: User_Type_Admin,
    Pharmacist: User_Type_Pharmacist,

    GetTranslation: (type) => {
        switch (type) {
            case User_Type_Admin: return "admin";
            case User_Type_Pharmacist: return "pharmacist";
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
            case User_Status_Inactive: return "inactive";
            case User_Status_Disabled: return "disabled";
        }
    }
};

