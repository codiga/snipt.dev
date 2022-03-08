import { gql } from "@apollo/client";

export const GET_PUBLIC_RECIPES_SUMMARY = gql`
  query getPublicRecipes(
    $howmany: Long!
    $skip: Long!
    $term: String
    $onlyPublic: Boolean
  ) {
    assistantRecipesSemanticSearch(
      howmany: $howmany
      skip: $skip
      term: $term
      onlyPublic: $onlyPublic
    ) {
      id
      name
      tags
      uses
      language
    }
  }
`;

export const GET_PUBLIC_RECIPES_FULL = gql`
  query getPublicRecipes(
    $howmany: Long!
    $skip: Long!
    $languages: [LanguageEnumeration!]
    $term: String
    $onlyPublic: Boolean
  ) {
    assistantRecipesSemanticSearch(
      howmany: $howmany
      skip: $skip
      languages: $languages
      term: $term
      onlyPublic: $onlyPublic
    ) {
      id
      name
      description
      tags
      code
      imports
      language
      uses
      comments(howmany: 100, skip: 0) {
        id
        creationTimestampMs
        rating
        comment
        author {
          id
          info {
            firstname
            lastname
          }
        }
      }
      commentsCount
    }
  }
`;

export const GET_PUBLIC_RECIPE_BY_ID = gql`
  query assistantPublicRecipe(
    $id: Long!
    $howmanycomments: Long!
    $skipcomments: Long!
  ) {
    assistantPublicRecipe(id: $id) {
      id
      name
      description
      isPublic
      filenamePatterns
      keywords
      tags
      shortcut
      code
      imports
      language
      creationTimestampMs
      uses
      averageRating
      owner {
        id
        username
        email
        info {
          firstname
          lastname
          url
        }
      }
      comments(howmany: $howmanycomments, skip: $skipcomments) {
        id
        creationTimestampMs
        rating
        comment
        securityFlag
        author {
          id
          username
          email
          info {
            firstname
            lastname
            url
          }
        }
      }
      commentsCount
      cookbook {
        id
        name
        description
        isPublic
        creationTimestampMs
      }
      isSubscribed
    }
  }
`;