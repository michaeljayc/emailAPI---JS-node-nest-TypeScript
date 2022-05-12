
export const incorrectUserPassword = () => ({
    success: false,
    count: 0,
    message: "Incorrect Password.",
    data: null
})

export const userEmailDoesNotExist = (email: string) => ({
    success: false,
    count: 0,
    message: `${email} does not exist.`,
    data: null,
})