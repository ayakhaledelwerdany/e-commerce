
const generateMessage = (entity)=>( { 
    alreadyExist : `${entity} Already Exist`,
    notFound : `${entity} Not Found`,
    failToCreate : `Fail To Create ${entity}`,
    failToUpdate : `Fail To Update ${entity}`,
    failToDelete : `Fail To Delete ${entity}`, 
    createdSuccessfully : `${entity} Created Successfully`,
    updatedSuccessfully : `${entity} Updated Successfully`,
    deletedSuccessfully : `${entity} Deleted Successfully`
})

export const messages ={
    category:{...generateMessage('Category'),
    // if 'category' have extra message than 'subcategory'
    cannotReach :"maybe error"},
    subcategory:generateMessage('Subcategory'),
    brand : generateMessage('brand'),
    product : generateMessage('product'),
    coupon : generateMessage('coupon'),
    order:  generateMessage('order'),
    review:  generateMessage('review'),
    user :{...generateMessage('user'),
    invalidCredentials: "Invalid Credentials",
    notAuthorized: "User Not Authorized"
    },


    file:{isRequired:"File Is Required"}

}