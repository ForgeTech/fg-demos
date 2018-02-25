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
    $orderBy: LinkOrderBy = createdAt_DESC
  ) {
    allLinks(
      first: $first,
      skip: $skip,
      orderBy: $orderBy
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
      votes {
        id
        user {
          id
        }
      }
    }
    _allLinksMeta {
      count
    }
  }
`;

export interface AllLinkQueryResponse {
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
      password: $password,
    ){
      id
      token
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
  mutation CreateVoteMutation($userId: ID!, $linkId: ID!) {
    createVote(userId: $userId, linkId: $linkId) {
      id
      link {
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

export const ALL_LINKS_SEARCH_QUERY = gql`
  query AllLinksSearchQuery($searchText: String!) {
    allLinks(filter: {
      OR: [{
        url_contains: $searchText
      }, {
        description_contains: $searchText
      }]
    }) {
      id
      url
      description
      createdAt
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
`;

export interface AllLinksSearchQueryResponse {
  loading: boolean;
  allLinks: Link[];
  _allLinksMeta: {
    count: number
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