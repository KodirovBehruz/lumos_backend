import slugify from 'slugify'

export const formatedToSlug = (input) => {
    if (!input || typeof input !== "string") {
        throw new Error("Invalid input");
    }
    return slugify(input, {
        lower: true,
        strict: true,
    })
}