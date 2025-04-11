import { StrictMode } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const client = new ApolloClient({
    uri: 'http://localhost:4000',
    cache: new InMemoryCache(),
});

// client
//     .query({
//         query: gql`
//             query GetUsers {
//                 users {
//                     name
//                 }
//             }
//         `,
//     })
//     .then((res) => {
//         console.log('res', res);
//     });

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </StrictMode>
);
