import {legacy_createStore as createStore,applyMiddleware } from 'redux'
import reducers from './reducers'
import  thunk from 'redux-thunk'
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; //localStorage机制
import { composeWithDevTools } from 'redux-devtools-extension'
  // 数据对象
  const storageConfig = {
    key: 'root', // 必须有的
    storage:storage, // 缓存机制
    blacklist: ['imgs'] // reducer 里不持久化的数据,除此外均为持久化数据
}

const myPersistReducer = persistReducer(storageConfig, reducers)
const store = createStore(myPersistReducer,composeWithDevTools(applyMiddleware(thunk)))
export const persistor = persistStore(store)
export default store