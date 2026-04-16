import { gql } from "@apollo/client";

// Get all the course data
export const GET_COURSES = gql`
  query courseGet {
    courseGet {
      data {
        description
        duration
        id
        instructorName
        level
        price
        title
      }
    }
  }
`;
// Mutation to send the course data to the server
export const ADD_COURSE = gql`
  mutation courseAdd(
    $description: String
    $duration: String!
    $instructor_name: String!
    $level: String!
    $price: Int!
    $title: String!
  ) {
    courseAdd(
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

// Mutation to delete the course
export const DELETE_COURSE = gql`
 mutation courseDelete($id:String!){
 courseDelete(id:$id) {
      message
      success
    }
}
`;

// Mutation to update the course
// src/graphql/coursesOps.ts

export const UPDATE_COURSE = gql`
  mutation courseUpdate(
    $id: String!,
    $description: String, 
    $duration: String!, 
    $instructor_name: String!, 
    $level: String!, 
    $price: Int!, 
    $title: String!
  ) {
    courseUpdate(
      id: $id,
      description: $description,
      duration: $duration,
      instructor_name: $instructor_name,
      level: $level,
      price: $price,
      title: $title
    ) {
      message
      success
    }
  }
`;
