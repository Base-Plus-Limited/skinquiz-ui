import ICustomProductDBModel from "../../Interfaces/CustomProduct";
import { IErrorResponse } from "../../Interfaces/ErrorResponse";
import { IQuizQuestion } from "../../Interfaces/QuizQuestion";
import { IIngredient, NewProductType, WordpressProduct } from "../../Interfaces/WordpressProduct";

export const createMoisturiser = async (
  userName: string,
  quizQuestions: IQuizQuestion[],
  baseIngredient: IIngredient,
  sortedIngredients: IIngredient[],
  setApplicationError: React.Dispatch<React.SetStateAction<IErrorResponse>>,
  saveQuizToDatabase: (productId: number, applicationErrorFunc: (value: React.SetStateAction<IErrorResponse>) => void, quizQuestions: IQuizQuestion[]) => Promise<any>,
  uniqueId: string,
  setQuizToCompleted: React.Dispatch<React.SetStateAction<boolean>>,
  toggleLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setQuizToCompleted(true);
  toggleLoading(true);
  return fetch('/api/new-product', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-cache',
    body: JSON.stringify(getSimpleProduct(userName, sortedIngredients, baseIngredient))
  })
    .then(res => res.ok ? res.json() : res.json().then((errorResponse: IErrorResponse) => {
      errorResponse.uiMessage = `Sorry${userName ? ` ${userName}` : ""} we weren't able to create your moisturiser`;
      setApplicationError(errorResponse);
    }))
    .then((product: WordpressProduct) => {
      if (product) {
        return Promise.allSettled([
          saveProductToDatabase(product.id, sortedIngredients),
          saveQuizToDatabase(product.id, setApplicationError, quizQuestions)
        ])
        .then(result => {
          if (result.some(x => x.status !== "rejected")) {
            return product.id;
          }
          setApplicationError({
            error: true,
            code: 400,
            message: "",
            uiMessage: `Sorry${userName ? ` ${userName}` : ""} we weren't able to create your moisturiser`
          })
          return undefined;
        })
      }
    })
    .catch((error: IErrorResponse) => {
      setApplicationError({
        error: true,
        code: error.code,
        message: error.message,
        uiMessage: `Sorry${userName ? ` ${userName}` : ""} we weren't able to create your moisturiser`
      })
    });
}

const getTotalPrice = (ingredientOnePrice: string, ingredientTwoPrice: string, baseIngredientPrice: string) => {
  const total = Number(ingredientOnePrice) + Number(ingredientTwoPrice) + Number(baseIngredientPrice);
  return total.toFixed(2);
}

export const getSimpleProduct = (
  userName: string,
  sortedIngredients: IIngredient[],
  baseIngredient: IIngredient
  ) => {
  return {
    name: getProductName(userName, "simple"),
    type: "simple",
    regular_price: getTotalPrice(sortedIngredients[0].price, sortedIngredients[1].price, baseIngredient.price),
    purchase_note: `Your custom mixture including ${sortedIngredients[0].name}, ${sortedIngredients[1].name} & the signature base+ ingredient`,
    description: '',
    short_description: `Your custom mixture including ${sortedIngredients[0].name}, ${sortedIngredients[1].name} & the signature base+ ingredient`,
    categories: [
      {
        id: 21
      }
    ],
    images: [
      {
        src: 'http://baseplus.co.uk/wp-content/uploads/2018/12/productImageDefault.jpg'
      }
    ]
  }
}

export const saveProductToDatabase = (productId: number, sortedIngredients: IIngredient[]) => {
  return fetch('/api/save-product', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-cache',
    body: JSON.stringify(createFinalProductToSaveToDatabase(productId, sortedIngredients))
  })
}

const createFinalProductToSaveToDatabase = (productId: number, sortedIngredients: IIngredient[]) => {
  const databaseProduct: ICustomProductDBModel = {
    ingredients: sortedIngredients.map(ingredient => {
      return {
        name: ingredient.name,
        id: ingredient.id
      }
    }),
    amended: false,
    productId: productId
  };
  return databaseProduct;
}

const getProductName = (userName: string, productType: NewProductType) => {
  if ((productType === "grouped") && (userName))
      return `${userName}'s Bespoke Bundle`;  
  if (productType === "grouped")
    return "Your Bespoke Bundle";
  if (userName)
    return `${userName}'s Bespoke Moisturiser`;    
  return "Your Bespoke Moisturiser";
}
