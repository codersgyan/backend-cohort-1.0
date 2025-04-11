import React from 'react';
import { useQuery, gql } from '@apollo/client';

// GraphQL query to fetch a post by ID
const GET_POST = gql`
    query GetPost($id: ID!) {
        post(id: $id) {
            id
            content
            author {
                name
            }
        }
    }
`;

const SocialMediaPost = ({ postId }) => {
    const { loading, error, data } = useQuery(GET_POST, {
        variables: { id: postId },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const { post } = data;

    // Placeholder for avatar using the first letter of the user's name
    const initial = post.author.name.charAt(0).toUpperCase();

    return (
        <div className="fb-post-card">
            <div className="fb-post-header">
                <div className="fb-avatar">{initial}</div>
                <div className="fb-user-details">
                    <span className="fb-user-name">{post.author.name}</span>
                    <span className="fb-post-time">• Just now</span>
                </div>
            </div>
            <div className="fb-post-content">{post.content}</div>
            <div className="fb-post-footer">
                <button className="fb-btn">Like</button>
                <button className="fb-btn">Comment</button>
                <button className="fb-btn">Share</button>
            </div>
        </div>
    );
};

export default SocialMediaPost;
