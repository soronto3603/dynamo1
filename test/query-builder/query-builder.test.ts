import { Compiler } from '../../src/query-builder/compiler'
import { beginsWith } from '../../src/query-builder/operators/begins-with-operator-resolver'
import { between } from '../../src/query-builder/operators/between-operator-resolver'
import { QueryBuilder } from '../../src/query-builder/query-builder'


describe('testsuite of query-builder/query-builder', () => {
  const compiler = new Compiler({
    tableName: 'table_name',
    pk: { name: 'table_pk' },
    sk: { name: 'table_sk' },
    gsi: [
      {
        name: 'gsi0',
        pk: { name: 'gsi0_pk' },
        sk: { name: 'gsi0_sk' },
      },
    ],
  })

  it('test key equal operator', () => {
    expect(compiler.compile(new QueryBuilder().key({
      pk: 'users',
      sk: 10,
    }))).toEqual({
      TableName: 'table_name',
      KeyConditionExpression: 'table_pk = :pk and table_sk = :sk',
      ExpressionAttributeNames: {
      },
      ExpressionAttributeValues: {
        ':pk': { S: 'users' },
        ':sk': { N: '10' },
      },
    })

    expect(compiler.compile(new QueryBuilder().key({
      pk: 'users',
      sk: ['=', 10],
    }))).toEqual({
      TableName: 'table_name',
      KeyConditionExpression: 'table_pk = :pk and table_sk = :sk',
      ExpressionAttributeNames: {
      },
      ExpressionAttributeValues: {
        ':pk': { S: 'users' },
        ':sk': { N: '10' },
      },
    })
  })

  it('test key comparision operator', () => {
    const operators = ['>', '>=', '<', '<='] as ('>' | '>=' | '<' | '<=')[]
    for (const operator of operators) {
      expect(compiler.compile(new QueryBuilder().key({
        pk: 'users',
        sk: [operator, 10],
      }))).toEqual({
        TableName: 'table_name',
        KeyConditionExpression: `table_pk = :pk and table_sk ${operator} :sk`,
        ExpressionAttributeNames: {
        },
        ExpressionAttributeValues: {
          ':pk': { S: 'users' },
          ':sk': { N: '10' },
        },
      })
    }
  })

  it('test key beginsWith operator', () => {
    expect(compiler.compile(new QueryBuilder().key({
      pk: 'users',
      sk: beginsWith('wan2land-'),
    }))).toEqual({
      TableName: 'table_name',
      KeyConditionExpression: 'table_pk = :pk and begins_with(table_sk, :sk)',
      ExpressionAttributeNames: {
      },
      ExpressionAttributeValues: {
        ':pk': { S: 'users' },
        ':sk': { S: 'wan2land-' },
      },
    })
  })

  it('test key between operator', () => {
    expect(compiler.compile(new QueryBuilder().key({
      pk: 'users',
      sk: between('id_0000', 'id_0100'),
    }))).toEqual({
      TableName: 'table_name',
      KeyConditionExpression: 'table_pk = :pk and table_sk between :sk_from and :sk_to',
      ExpressionAttributeNames: {
      },
      ExpressionAttributeValues: {
        ':pk': { S: 'users' },
        ':sk_from': { S: 'id_0000' },
        ':sk_to': { S: 'id_0100' },
      },
    })
  })

  it('test key by index name', () => {
    expect(compiler.compile(new QueryBuilder().key({
      pk: 'users',
      sk: 10,
    }, 'gsi0'))).toEqual({
      TableName: 'table_name',
      KeyConditionExpression: 'gsi0_pk = :pk and gsi0_sk = :sk',
      ExpressionAttributeNames: {
      },
      IndexName: 'gsi0',
      ExpressionAttributeValues: {
        ':pk': { S: 'users' },
        ':sk': { N: '10' },
      },
    })
  })

  it('test limit', () => {
    expect(compiler.compile(new QueryBuilder().limit(10))).toEqual({
      TableName: 'table_name',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
      Limit: 10,
    })

    expect(compiler.compile(new QueryBuilder().limit(null))).toEqual({
      TableName: 'table_name',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
    })
  })

  it('test scanIndexForward', () => {
    expect(compiler.compile(new QueryBuilder().scanIndexForward(true))).toEqual({
      TableName: 'table_name',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
      ScanIndexForward: true,
    })

    expect(compiler.compile(new QueryBuilder().scanIndexForward(false))).toEqual({
      TableName: 'table_name',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
      ScanIndexForward: false,
    })

    expect(compiler.compile(new QueryBuilder().scanIndexForward(null))).toEqual({
      TableName: 'table_name',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
    })
  })

  it('test scanIndexForward', () => {
    expect(compiler.compile(new QueryBuilder().scanIndexForward(true))).toEqual({
      TableName: 'table_name',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
      ScanIndexForward: true,
    })

    expect(compiler.compile(new QueryBuilder().scanIndexForward(false))).toEqual({
      TableName: 'table_name',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
      ScanIndexForward: false,
    })

    expect(compiler.compile(new QueryBuilder().scanIndexForward(null))).toEqual({
      TableName: 'table_name',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
    })
  })

  it('test exclusiveStartKey', () => {
    expect(compiler.compile(new QueryBuilder().exclusiveStartKey({ pk: 'users', sk: 100 }))).toEqual({
      TableName: 'table_name',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
      ExclusiveStartKey: {
        pk: { S: 'users' },
        sk: { N: '100' },
      },
    })
  })
})