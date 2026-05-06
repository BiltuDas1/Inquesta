// import { gql } from "@apollo/client";

// // Get all the course data
// export const GET_COURSES = gql`
//   query courseGet {
//     courseGet {
//       data {
//         description
//         duration
//         id
//         instructorName
//         level
//         price
//         title
//       }
//     }
//   }
// `;
// // Mutation to send the course data to the server
// export const ADD_COURSE = gql`
//   mutation courseAdd(
//     $description: String
//     $duration: String!
//     $instructor_name: String!
//     $level: String!
//     $price: Int!
//     $title: String!
//   ) {
//     courseAdd(
//       description: $description
//       duration: $duration
//       instructor_name: $instructor_name
//       level: $level
//       price: $price
//       title: $title
//     ) {
//       message
//       success
//     }
//   }
// `;

// // Mutation to delete the course
// export const DELETE_COURSE = gql`
//   mutation courseDelete($id: String!) {
//     courseDelete(id: $id) {
//       message
//       success
//     }
//   }
// `;

// // Mutation to update the course
// // src/graphql/coursesOps.ts

// export const UPDATE_COURSE = gql`
//   mutation courseUpdate(
//     $id: String!
//     $description: String
//     $duration: String!
//     $instructor_name: String!
//     $level: String!
//     $price: Int!
//     $title: String!
//   ) {
//     courseUpdate(
//       id: $id
//       description: $description
//       duration: $duration
//       instructor_name: $instructor_name
//       level: $level
//       price: $price
//       title: $title
//     ) {
//       message
//       success
//     }
//   }
// `;

import { gql } from "@apollo/client";

export const GET_COURSES = gql`
  query courseGet($lastID: String, $limit: Int!) {
    courseGet(lastID: $lastID, limit: $limit) {
      success
      message
      data {
        id
        title
        description
        instructorName
        duration
        level
        price
        icon
      }
    }
  }
`;

export const REQUEST_UPLOAD = gql`
  mutation request_upload($mimetype: String!) {
    request_upload(mimetype: $mimetype) {
      success
      message
      data {
        url
        filename
      }
    }
  }
`;

export const ADD_COURSE = gql`
  mutation courseAdd(
    $description: String
    $duration: String!
    $instructor_name: String!
    $level: String!
    $price: Int!
    $title: String!
    $icon_name: String
  ) {
    courseAdd(
      description: $description
      duration: $duration
      instructor_name: $instructor_name
      level: $level
      price: $price
      title: $title
      icon_name: $icon_name
    ) {
      message
      success
    }
  }
`;

export const UPDATE_COURSE = gql`
  mutation courseUpdate(
    $id: String!
    $description: String
    $duration: String!
    $instructor_name: String!
    $level: String!
    $price: Int!
    $title: String!
  ) {
    courseUpdate(
      id: $id
      description: $description
      duration: $duration
      instructor_name: $instructor_name
      level: $level
      price: $price
      title: $title
    ) {
      message
      success
    }
  }
`;

export const DELETE_COURSE = gql`
  mutation courseDelete($id: String!) {
    courseDelete(id: $id) {
      message
      success
    }
  }
`;
