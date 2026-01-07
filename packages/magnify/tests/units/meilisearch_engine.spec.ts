import { test } from '@japa/runner'
import { Index } from 'meilisearch'
import sinon, { type SinonMock } from 'sinon'
import { MeilisearchEngine } from '../../src/engines/meilisearch.js'
import { SearchableModel } from '../fixtures/searchable_model.js'
import { SearchableCustomKeyModel } from '../fixtures/searchable_custom_key_model.js'

test.group('Meilisearch engine', (group) => {
  let index: Index
  let clientMock: SinonMock
  let indexMock: SinonMock
  let engine: MeilisearchEngine

  group.each.setup(() => {
    index = new Index({ host: 'http://localhost:1234' }, 'table', 'id')

    indexMock = sinon.mock(index)

    engine = new MeilisearchEngine({
      host: 'http://localhost:1234',
    })

    clientMock = sinon.mock(engine.client)

    SearchableModel.engine = engine
  })

  group.each.teardown = () => {
    sinon.restore()
  }

  test('update adds objects to index', async () => {
    clientMock.expects('index').once().withArgs('table').returns(index)

    indexMock
      .expects('addDocuments')
      .once()
      .withArgs([{ id: '1' }], { primaryKey: 'id' })

    await engine.update(new SearchableModel('1'))

    clientMock.verify()
    indexMock.verify()
  })

  test('delete removes objects to index', async () => {
    clientMock.expects('index').once().withArgs('table').returns(index)
    indexMock.expects('deleteDocuments').once().withArgs(['1']).returns({})

    await engine.delete(new SearchableModel('1'))

    clientMock.verify()
    indexMock.verify()
  })

  test('update with custom search key', async () => {
    clientMock.expects('index').once().withArgs('table').returns(index)
    indexMock
      .expects('addDocuments')
      .once()
      .withArgs([{ 'id': '1', 'custom-key': 'custom-key.1' }])
      .returns(index)

    await engine.update(new SearchableCustomKeyModel('1'))

    clientMock.verify()
    indexMock.verify()
  })
})
