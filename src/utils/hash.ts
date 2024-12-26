import crypto from 'crypto'

// hash random piece of data to hash differently unique each password
// so if a password is cracked no need to worry about the next ones. 
export function hashPassword(password: string){
    // when a user is goint to register produced a salt
    const salt = crypto.randomBytes(16).toString("hex")
    // hash the password along with the salt
    const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString('hex');
    // store the hash with the user
    return {hash, salt}
}

export function verifyPassword(
    {candidatePassword, 
    salt,
    hash
}: {
    candidatePassword:string, 
    salt:string, 
    hash:string
} ){
    // when a user is login check if the same hash is able to be produced
    const candidateHash = crypto.pbkdf2Sync(
        candidatePassword, 
        salt, 
        1000, 
        64, 
        "sha512").toString('hex');

    return candidateHash === hash;
}