import {
  Link,
  User,
  Vote,
  Comment,
  CommentVote
} from './types';
import gql from 'graphql-tag';

export const ALL_LINKS_QUERY = gql`
  query AllLinksQuery (
    $first: Int = 25,
    $skip: Int = 0,
    $orderBy: LinkOrderBy = createdAt_DESC,
    $searchText: String = ""
  ) {
    allLinks(
      first: $first,
      skip: $skip,
      orderBy: $orderBy,
      filter: {
      OR: [{
        url_contains: $searchText
      }, {
        description_contains: $searchText
      }]
    }
    ) {
      id
      createdAt
      url
      description
      voteCount
      votes {
        id
        user {
          id
        }
      }
      commentCount
      postedBy {
        id
        name
      }
    }
    _allLinksMeta {
      count
    }
  }
`;

export interface AllLinksQueryResponse {
  allLinks: Link[];
  loading: boolean;
  _allLinksMeta: {
    count: number
  };
}

export const CREATE_LINK_MUTATION = gql`
  mutation CreateLinkMutation (
    $description: String!,
    $url: String!,
    $postedById: ID!,
    $voteCount: Int!
    $commentCount: Int!
  ) {
    createLink (
      description: $description
      url: $url
      postedById: $postedById
      voteCount: $voteCount
      commentCount: $commentCount
    ) {
      id
      createdAt
      url
      description
      voteCount
      postedBy {
        id
        name
      }
    }
  }
`;

export interface CreateLinkMutationResponse {
  createLink: Link;
  loading: boolean;
  postedBy: {
    id
    name
  };
}

export const CREATE_USER_MUTATION = gql`
  mutation CreateUserMutation($name: String!, $email: String!, $password: String!){
    signupUser(
      name: $name
      email: $email
      password: $password
    ){
      id
    }
    authenticateUser(
      email: $email,
      password: $password
    ){
      id
      token
      name
    }
  }
`;

export interface CreateUserMutationResponse {
  loading: boolean;
  createUser: User;
  signinUser: {
    token: string,
    user?: User
  };
}

export const SIGNIN_USER_MUTATION = gql`
  mutation SigninUserMutation($email: String!, $password: String!) {
    authenticateUser(
      email: $email,
      password: $password,
    ) {
      id
      token
      name
    }
  }
`;

export interface SigninUserMutationResponse {
  loading: boolean;
  signinUser: {
    token: string,
    user?: User
  };
}

export const CREATE_VOTE_MUTATION = gql`
  mutation CreateVoteMutation($userId: ID!, $linkId: ID!, $voteCount: Int!) {
    updateLink(
      id: $linkId,
      voteCount: $voteCount
    ){
    	id
  	}
  	createVote(
      userId: $userId,
      linkId: $linkId
    ) {
      id
      link {
        voteCount
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;

export interface CreateVoteMutationResponse {
  loading: boolean;
  createVote: {
    id: string;
    link: Link;
    user: User;
  };
}

export const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    Link(filter: {
      mutation_in: [CREATED]
    }) {
      node {
        id
        url
        description
        createdAt
        voteCount
        commentCount
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

export interface NewLinkSubcriptionResponse {
  node: Link;
}

export const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    Vote(filter: {
      mutation_in: [CREATED]
    }) {
      node {
        id
        link {
          id
          url
          description
          createdAt
          postedBy {
            id
            name
          }
          voteCount
          votes {
            id
            user {
              id
            }
          }
        }
        user {
          id
        }
      }
    }
  }
`;

export interface NewVoteSubcriptionResponse {
  node: Vote;
}

export const CREATE_COMMENT_MUTATION = gql`
mutation CreateComment(
  $linkId: ID!,
  $userId: ID!,
  $depth: Int!,
  $message: String!
) {
  createComment (
    linkId: $linkId,
    userId: $userId,
    depth: $depth,
		message: $message
  ) {
    id
    message
    depth
    link {
      id
      description
      url
    }
    user {
      id
      name
    }
  }
}
`;

export interface CreateCommentMutationResponse {
  loading: boolean;
  createComment: {
    id: string;
    message: string;
    depth: number;
    user: User;
    link: Link;
  };
}
