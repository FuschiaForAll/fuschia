import * as expect from 'expect'
import assert from 'assert'

describe('Frontend builder tests', () => {
  const { convertImports, convertHooks } = require('../src/utils')
  describe('convertImports', () => {
    it('should parse single default import properly', () => {
      assert.strictEqual(
        convertImports({
          react: {
            React: 'default',
          },
        }),
        `import React from 'react'`
      )
    })
    it('should parse single module properly', () => {
      assert.strictEqual(
        convertImports({
          react: {
            useState: 'single',
          },
        }),
        `import { useState } from 'react'`
      )
    })
    it('should parse multiple modules properly', () => {
      assert.strictEqual(
        convertImports({
          react: {
            useState: 'single',
            useEffect: 'single',
          },
        }),
        `import { useState, useEffect } from 'react'`
      )
    })
    it('should parse default and single modules properly', () => {
      assert.strictEqual(
        convertImports({
          react: {
            React: 'default',
            useState: 'single',
          },
        }),
        `import React, { useState } from 'react'`
      )
    })
    it('should parse default and multiple modules properly', () => {
      assert.strictEqual(
        convertImports({
          react: {
            React: 'default',
            useState: 'single',
            useEffect: 'single',
          },
        }),
        `import React, { useState, useEffect } from 'react'`
      )
    })
    it('should parse multiple imports of different types', () => {
      assert.strictEqual(
        convertImports({
          react: {
            React: 'default',
            useState: 'single',
            useEffect: 'single',
          },
          'react-native': {
            View: 'single',
          },
        }),
        `import React, { useState, useEffect } from 'react'\nimport { View } from 'react-native'`
      )
    })
  })
  describe('build hooks', () => {
    it(`should destruct a graphql mutation properly`, () => {
      assert.strictEqual(
        convertHooks({
          useLoginMutation: {
            type: 'array',
            value: [
              {
                type: 'variable',
                value: 'login',
              },
              {
                type: 'destructed',
                value: {
                  data: {
                    type: 'variable',
                    value: 'data',
                    renamed: 'loginData',
                  },
                  loading: {
                    type: 'variable',
                    value: 'loading',
                    renamed: 'loginLoading',
                  },
                  error: {
                    type: 'variable',
                    value: 'error',
                    renamed: 'loginError',
                  },
                },
              },
            ],
          },
        }),
        `const [login, { data: loginData, loading: loginLoading, error: loginError }] = useLoginMutation()`
      )
    })
    it(`should build navigation properly`, () => {
      assert.strictEqual(
        convertHooks({
          'useNavigation<any>': {
            type: 'variable',
            value: 'navigate',
          },
        }),
        `const navigate = useNavigation<any>()`
      )
    })
    it(`should create a useState properly`, () => {
      assert.strictEqual(
        convertHooks({
          'useState<boolean>': {
            type: 'array',
            value: [
              {
                type: 'variable',
                value: 'loginInput',
              },
              {
                type: 'variable',
                value: 'setLoginInput',
              },
            ],
          },
        }),
        `const [loginInput, setLoginInput] = useState<boolean>()`
      )
    })
    it(`should create multiple hooks properly`, () => {
      assert.strictEqual(
        convertHooks({
          'useNavigation<any>': {
            type: 'variable',
            value: 'navigate',
          },
          'useState<boolean>': {
            type: 'array',
            value: [
              {
                type: 'variable',
                value: 'loginInput',
              },
              {
                type: 'variable',
                value: 'setLoginInput',
              },
            ],
          },
        }),
        `const navigate = useNavigation<any>()\nconst [loginInput, setLoginInput] = useState<boolean>()`
      )
    })
    it(`should create multiple useState hooks`, () => {
      assert.strictEqual(
        convertHooks({
          'useState<string>': {
            type: 'multiple',
            value: [
              {
                type: 'array',
                value: [
                  {
                    type: 'variable',
                    value: 'loginInput',
                  },
                  {
                    type: 'variable',
                    value: 'setLoginInput',
                  },
                ],
              },
              {
                type: 'array',
                value: [
                  {
                    type: 'variable',
                    value: 'passwordInput',
                  },
                  {
                    type: 'variable',
                    value: 'setPasswordInput',
                  },
                ],
              },
            ],
          },
        }),
        `const [loginInput, setLoginInput] = useState<string>()\nconst [passwordInput, setPasswordInput] = useState<string>()`
      )
    })
  })
})
