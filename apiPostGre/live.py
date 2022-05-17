import random
import string


class LiveData:
    def __init__(self):
        self.roomProf=self.get_random_string(5)
        self.listEtu=[]

    def get_random_string(self,length):
        # choose from all lowercase letter
        letters = string.ascii_lowercase
        result_str = ''.join(random.choice(letters) for i in range(length))