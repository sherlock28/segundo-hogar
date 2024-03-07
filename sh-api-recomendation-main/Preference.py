from Sport import Sport

class Preference:
    def __init__(self):
        self.sport = []
        self.genremovies = []
        self.genremusic = []
        self.hobbies = []
        self.pets = []

    def __repr__(self):
        return f'sport={self.sport} ' \
               f'genremovies={self.genremovies} ' \
               f'genremusic={self.genremusic} ' \
               f'hobbies = {self.hobbies} ' \
               f'pets = {self.pets}'


