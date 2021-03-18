import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../../auth/utils'
import { deleteImageById } from '../../businessLogic/ImageCRUD'

const logger = createLogger('deleteImageById')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing deleteImageById event', { event })

  const userId = getUserId(event)
  const imageId = event.pathParameters.imageId

  const result = await deleteImageById(userId, imageId)

  if(result){
    return {
        statusCode: 204,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: ''
      }
  }
  else{
    return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: 'Not Found/Invalid'
      }
  }
}
