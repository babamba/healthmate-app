import gql from "graphql-tag";

export const POST_FRAGMENT = gql`
  fragment PostParts on Post {
    id
    location
    caption
    user {
      id
      avatar
      username
    }
    files {
      id
      url
    }
    likeCount
    isLiked
    comments {
      id
      text
      user {
        id
        username
      }
    }
    createdAt
  }
`;

export const USER_FRAGMENT = gql`
  fragment UserParts on User {
    id
    avatar
    username
    # fullName
    isFollowing
    isSelf
    bio
    followingCount
    followersCount
    postsCount
    posts {
      ...PostParts
    }
  }
  ${POST_FRAGMENT}
`;

export const PLAN_FRAGMENT = gql`
  fragment PlanParts on Plan {
    id
    exerciseDate
    exerciseTime
    user {
      ...UserParts
    }
    exerciseType {
      ...ExerciseTypeParts
    }
    planContent {
      ...PlanContentParts
    }
  }
`;

export const PLAN_CONTENT_FRAGMENT = gql`
  fragment PlanContentParts on PlanContent {
    id
    planTitle
  }
`;

export const EXERCISE_TYPE_FRAGMENT = gql`
  fragment ExerciseTypeParts on Exercise {
    id
    title
  }
`;
