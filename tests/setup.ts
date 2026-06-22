import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'
import { Model } from 'jstorm/chrome/local'
import { installMemoryStorage } from 'jstorm/testing'

// jstorm の Model 層を拡張外(node/jsdom)でテストするためのストレージ。各テスト前に新しい
// in-memory StorageArea を割り当て、テスト間で状態が漏れないようにする（jstorm/testing）。
// jstorm@0.18.1 で chrome/local は import 時に chrome を無ガード参照しなくなったため、
// 以前ここに置いていた手書きの chrome.storage モックは不要になった。
beforeEach(() => {
  Model.useStorage(installMemoryStorage())
})

afterEach(() => {
  cleanup()
})
