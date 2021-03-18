import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../../auth/utils'
import { getImages } from '../../businessLogic/ImageCRUD'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getImages')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing getImages event', { event })

  const userId = getUserId(event)

  const items = await getImages()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}
