export async function isAllowed(user, ...allowedRoles) {
    if (!user) {
        return false;
    }

    return allowedRoles.includes(user.role);
}   