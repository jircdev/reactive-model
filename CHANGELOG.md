# CHANGELOG

## 1.1.2 
- Bug fix: Fixed error when passing parameters in the Item post method.
## 1.1.1 (July 20, 2023)

### Item and collection
- New feature: Now the methods such as save, publish, and load can be overwritten in Children objects and call super method. This is useful when it's necessary to manage logic before executing the method or after it.
- Bug fix: Fixed an error when the same registry is instantiated multiple times.