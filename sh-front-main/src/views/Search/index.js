import React, {useEffect}from 'react';
import { Search } from 'components/Search';

export function SearchView() {
    useEffect(() => {
        localStorage.removeItem('maxDistance');
    }, []);
    return (
        <Search />
    )
}
