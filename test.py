import unittest

class TestViewer(unittest.TestCase):

    def test(self):
        self.assertEqual('testing is awesome', 'testing is awesome')

if __name__=='__main__':
    unittest.main()
