import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
  /** Mongo object id scalar type */
  ObjectId: any;
};

export type Component = {
  __typename?: 'Component';
  _id: Scalars['ObjectId'];
  defaultValue: Scalars['JSONObject'];
  icon: Scalars['String'];
  isContainer: Scalars['Boolean'];
  isRootElement: Scalars['Boolean'];
  name: Scalars['String'];
  schema: Scalars['JSONObject'];
};

export type ComponentInput = {
  defaultValue: Scalars['JSONObject'];
  icon: Scalars['String'];
  isContainer: Scalars['Boolean'];
  isRootElement: Scalars['Boolean'];
  name: Scalars['String'];
  schema: Scalars['JSONObject'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPackage: Package;
  publishComponents: Array<Component>;
};


export type MutationCreatePackageArgs = {
  packageInput: PackageInput;
};


export type MutationPublishComponentsArgs = {
  componentInput: Array<ComponentInput>;
};

export type Package = {
  __typename?: 'Package';
  _id: Scalars['ObjectId'];
  authorId: Scalars['ObjectId'];
  bundle: Scalars['String'];
  components: Array<Component>;
  packageName: Scalars['String'];
  repositoryUrl: Scalars['String'];
  scope: PackageScope;
  version: Scalars['String'];
};

export type PackageInput = {
  authorId: Scalars['ObjectId'];
  bundle: Scalars['String'];
  components: Array<ComponentInput>;
  packageName: Scalars['String'];
  repositoryUrl: Scalars['String'];
  scope: PackageScope;
  version: Scalars['String'];
};

/** The scope of the package. Globals are default available to everyone, Public are usable by everyone, Private is usable by permissions */
export enum PackageScope {
  Global = 'Global',
  Private = 'Private',
  Public = 'Public'
}

export type Query = {
  __typename?: 'Query';
  getComponents: Array<Component>;
  getPackages: Array<Package>;
};

export type GetPackagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPackagesQuery = { __typename?: 'Query', getPackages: Array<{ __typename?: 'Package', _id: any, packageName: string, repositoryUrl: string, version: string, bundle: string, authorId: any, scope: PackageScope, components: Array<{ __typename?: 'Component', _id: any, name: string, schema: any, defaultValue: any, icon: string, isRootElement: boolean, isContainer: boolean }> }> };


export const GetPackagesDocument = gql`
    query GetPackages {
  getPackages {
    _id
    packageName
    repositoryUrl
    version
    bundle
    components {
      _id
      name
      schema
      defaultValue
      icon
      isRootElement
      isContainer
    }
    authorId
    scope
  }
}
    `;

/**
 * __useGetPackagesQuery__
 *
 * To run a query within a React component, call `useGetPackagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPackagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPackagesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPackagesQuery(baseOptions?: Apollo.QueryHookOptions<GetPackagesQuery, GetPackagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPackagesQuery, GetPackagesQueryVariables>(GetPackagesDocument, options);
      }
export function useGetPackagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPackagesQuery, GetPackagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPackagesQuery, GetPackagesQueryVariables>(GetPackagesDocument, options);
        }
export type GetPackagesQueryHookResult = ReturnType<typeof useGetPackagesQuery>;
export type GetPackagesLazyQueryHookResult = ReturnType<typeof useGetPackagesLazyQuery>;
export type GetPackagesQueryResult = Apollo.QueryResult<GetPackagesQuery, GetPackagesQueryVariables>;