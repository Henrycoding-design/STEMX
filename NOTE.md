This code implements the stateful architecture:
+ Files API for pdfs that automatically reset every 45-48 hours -> save quota, no constant upload
+ Interactive API chains that preserve chat context on the SAME lesson/topic (conversation scope and interaction ids logics)
+ caching logics to prevent refreshes/close windows/tabs on interupting the behavior of stateful architecture or create unecessary duplicates


