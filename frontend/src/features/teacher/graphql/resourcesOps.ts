import { gql } from "@apollo/client";

export const GET_RESOURCES = gql`
  query GetResources($courseId: String) {
    getResources(courseId: $courseId) {
      success
      message
      data {
        id
        courseId
        title
        type
        url
        description
      }
    }
  }
`;

export const ADD_RESOURCE = gql`
  mutation AddResource(
    $courseId: String
    $title: String!
    $type: String!
    $url: String!
    $description: String
  ) {
    addResource(
      courseId: $courseId
      title: $title
      type: $type
      url: $url
      description: $description
    ) {
      success
      message
    }
  }
`;

export const UPDATE_RESOURCE = gql`
  mutation UpdateResource(
    $id: String!
    $courseId: String
    $title: String!
    $type: String!
    $url: String!
    $description: String
  ) {
    updateResource(
      id: $id
      courseId: $courseId
      title: $title
      type: $type
      url: $url
      description: $description
    ) {
      success
      message
    }
  }
`;

export const DELETE_RESOURCE = gql`
  mutation DeleteResource($id: String!) {
    deleteResource(id: $id) {
      success
      message
    }
  }
`;
