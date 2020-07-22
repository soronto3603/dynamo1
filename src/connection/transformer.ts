import { DynamoDB } from 'aws-sdk'

import { DynamoNode, ConnectionTableOption, DynamoCursor } from '../interfaces/connection'


export function toDynamoMap(item: Record<string, any>): DynamoDB.AttributeMap {
  return Object.entries(item).reduce((carry, [key, value]) => Object.assign(carry, {
    [key]: toDynamo(value),
  }), {})
}

export function toDynamo(item: any): DynamoDB.AttributeValue {
  if (item === null || typeof item === 'undefined') {
    return { NULL: true }
  }
  if (item instanceof Buffer) {
    return { B: item }
  }
  switch (typeof item) {
    case 'string':
      return { S: item }
    case 'number':
      return { N: `${item}` }
    case 'boolean':
      return { BOOL: item }
  }
  if (Array.isArray(item)) {
    return { L: item.map(toDynamo) }
  }
  return { M: toDynamoMap(item) }
}


export function fromDynamoMap(item: DynamoDB.AttributeMap): Record<string, any> {
  return Object.entries(item).reduce((carry, [key, value]) => Object.assign(carry, {
    [key]: fromDynamo(value),
  }), {})
}

export function fromDynamo(item: DynamoDB.AttributeValue): any {
  if (item.NULL) {
    return null
  }
  if (item.B) {
    return item.B
  }
  if ('S' in item) {
    return item.S
  }
  if (item.N) {
    return +item.N
  }
  if ('BOOL' in item) {
    return item.BOOL
  }
  if (item.L) {
    return item.L.map(fromDynamo)
  }
  if (item.M) {
    return fromDynamoMap(item.M)
  }
  throw new TypeError(`Unknown Dynamo attribute value. (item=${JSON.stringify(item)})`)
}

export function dynamoCursorToKey(cursor: DynamoCursor, option: ConnectionTableOption): DynamoDB.Key {
  return toDynamoMap({
    [option.pk.name]: cursor.pk,
    ...option.sk ? { [option.sk.name]: cursor.sk } : {},
  })
}

export function dynamoNodeToAttrs<TData>({ cursor, data }: DynamoNode<TData>, option: ConnectionTableOption): DynamoDB.AttributeMap {
  return toDynamoMap({
    [option.pk.name]: cursor.pk,
    ...option.sk ? { [option.sk.name]: cursor.sk } : {},
    ...data,
  })
}

export function attrsToDynamoNode<TData>(data: DynamoDB.AttributeMap, option: ConnectionTableOption): DynamoNode<TData> {
  const parsed = fromDynamoMap(data)

  const cursor: DynamoCursor = { pk: parsed[option.pk.name] }
  delete parsed[option.pk.name]

  if (option.sk && option.sk.name in parsed) {
    cursor.sk = parsed[option.sk.name]
    delete parsed[option.sk.name]
  }
  return { cursor, data: parsed as TData }
}
