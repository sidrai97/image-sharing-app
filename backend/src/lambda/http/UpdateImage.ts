import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../../auth/utils'
import { updateImage } from '../../businessLogic/ImageCRUD'
import { UpdateImageRequest } from '../../requests/UpdateImageRequest'

const logger = createLogger('updateImage')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing updateImage event', { event })

  const userId = getUserId(event)
  const imageId = event.pathParameters.imageId
  const updatedImage: UpdateImageRequest = JSON.parse(event.body)

  const result = await updateImage(imageId, userId, updatedImage.title, updatedImage.tagId)

  if(result){
    return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            item: result
        })
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
