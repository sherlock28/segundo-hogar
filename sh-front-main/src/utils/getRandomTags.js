export const getRandomTags = (preferences) => {

    let tags = [];
    const { genremovies, genremusic, hobbies, pets, sport } = preferences;
    tags.push(genremovies.length > 0 ? genremovies[Math.floor(Math.random() * genremovies.length)].name : "");
    tags.push(genremusic.length > 0 ? genremusic[Math.floor(Math.random() * genremusic.length)].name : "");
    tags.push(hobbies.length > 0 ? hobbies[Math.floor(Math.random() * hobbies.length)].name : "");
    tags.push(pets.length > 0 ? pets[Math.floor(Math.random() * pets.length)].name : "");
    tags.push(sport.length > 0 ? sport[Math.floor(Math.random() * sport.length)].name : "");
    

    return tags;
}