from Preference import Preference
class Person:
    def __init__(self,id_person,fullname,username,age,gender,state,city,bio):
        self.id_person = id_person
        self.username = username
        self.fullname = fullname
        self.age = age
        self.gender = gender
        self.bio = bio
        self.city = city
        self.state = state
        self.lifestyle = []
        self.preferences = Preference()
        # self.sport = []
        # self.genremovies = []
        # self.genremusic = []
        # self.hobbies = []
        # self.pets = []
        self.career = 0
        self.similarity = 0
        self.avatar = None



    def __repr__(self):
        return f'id={self.id_person} ' \
               f'username={self.username} ' \
               f'fullname={self.fullname} ' \
               f'lifestyle = {self.lifestyle} ' \





