// types.ts provides typescript-classes maching the
// properties of graphql schema-types defined in
// 'types.graphql'-file defined in the 'server/'-directory

/**
 * Interface to be implemented by classes
 * holding a application-wide unique id,
 * not just a, for example, an id unique within
 * a single table
*/
export interface UniqueId {
    id?: string;
}

/**
 * Interface for classes that hold the datetime-value
 * of their creation
*/
export interface CreatedAt {
    createdAt?: string;
}

/**
 * Interface for classes that hold the datetime-value
 * of when they where last updated.
*/
export interface UpdatedAt {
    updatedAt?: string;
}

/**
 * ManagedByGraphCool - This class should be used
 * to be extended by all classes representing graphql
 * schema-types managed by the graph.cool
 * backend-framework
 *
 * Class defines the common properties
 * id, createdAt and updated at that should
 * by available on every graphql schema-type
 * defined for this application and should be
 * extended by every according typescript 'graphql-type'
 * object-instance.
*/
 export class ManagedByGraphCool implements UniqueId, CreatedAt, UpdatedAt {
    /**
     * Unique instance id managed by the graphcool-framework
     */
    id?: string;
    /**
     * The datetime the particuler
     * graphql schema-type instance was created.
     * Managed by the graphcool-framework
     */
    createdAt?: string;
    /**
     * The datetime the particuler
     * graphql schema-type instance was updated.
     * Managed by the graphcool-framework
     */
    updatedAt?: string;
}

/**
 * Class to hold data available at graphql schema-type
 * Link, representing this schema-type within this application
*/
export class Link extends ManagedByGraphCool {
    /**
     * A short headline describing what this link
     * is about.
     */
    description?: string;
    /**
     * The actual url of the submitted link
     */
    url?: string;
    /**
     * Reference to the user who submitted the link
     */
    postedBy?: User;
    /**
     *  References to the upvotes casted on the link
     */
    votes?: Vote[];
    /**
     * Property to hold the count of casted votes
     * so links can be ordered by votes on the sever-side
     * by graphcool-framework default methodes.
     */
    voteCount?: number;
    /**
     * Reference to the comments received on the link
     */
    comments?: Comment[];
    /**
     * Property to hold the count of casted votes
     * so links can be ordered by votes on the sever-side
     * by graphcool-framework default methodes.
     */
    commentCount?: number;
}

/**
 * User - A User represents an authendicated Visitor of
 * the application and receives access to additional features
 * whitin the application
 *
 * Class to hold data available at graphql schema-type
 * User, representing this schema-type within this application
*/
export class User extends ManagedByGraphCool {
    /**
     * The unique nickname used by the user within the application
     */
    name?: string;
    /**
     * The unique email-adresse used by the user
     * to be verified within the application
     */
    email?: string;
    /**
     * The links submitted by the user
     */
    links?: Link[];
    /**
     * References a users votes casted on links
     */
    votes?: Vote[];
    /**
     * The users comments on submitted links
     */
    comments?: Comment[];
    /**
     * References a users votes casted on comments
     */
    commentUpVotes?: CommentVote[];
}

/**
 * Vote - A Vote is a flag indicating that a user liked
 * and/or found the contents of a submitted link useful
 *
 * Class to hold data available at graphql schema-type
 * Vote, representing this schema-type within this application
 */
export class Vote extends ManagedByGraphCool {
    /**
     * Reference to the user that casted that vote
     */
    user?: User;
    /**
     * Reference to the link the vote was casted on
     */
    link?: Link;
}

/**
 * Comment - A Comment represents a users response
 * to a posted link or comment
 *
 * Class to hold data available at graphql schema-type
 * Comment, representing this schema-type within this application
 */
export class Comment extends ManagedByGraphCool {
    /**
     * The message to replied to a link or comment
     */
    message?: string;
    /**
     * As comments can be casted on comments, this flag
     * should be used to signal how deep the casted comment 
     * is nested in the comment-tree structure
     */
    depth?: number;
    /**
     * Reference to the link a comment is replied to
     */
    link?: Link;
    /**
     * Reference to the user who casted the event
     */
    user?: User;
    /**
     * References the votes casted on the comment
     */
    votes?: CommentVote[];
    /**
     * Reference to the parent comment of a
     * reply to a comment
     */
    parent?: Comment;
    /**
     * References the children, or comments casted as reply
     * to a comment
     */
    responses?: Comment[];
}

/**
 * CommentVote - A CommentVote represents that a user liked and/or
 * found the response to link or comment useful.
 *
 * Class to hold data available at graphql schema-type
 * Comment, representing this schema-type within this application
 */
export class CommentVote extends ManagedByGraphCool {
    /**
     * Reference to the user casting the vote on a comment
     */
    user?: User;
    /**
     * Reference to the comment a user casted the vote on
     */
    comment?: Comment;
}
