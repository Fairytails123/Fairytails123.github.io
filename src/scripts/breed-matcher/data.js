/* ===========================================================================
   Breed Matcher — DATA LAYER
   ---------------------------------------------------------------------------
   The breed dataset and the quiz questions, lifted VERBATIM from the original
   standalone tool (public/breed-matcher/index.html, retired 2026-08-03 when the
   tool became the Astro page /breed-matcher/). Nothing here was retuned during
   the port: the numbers drive the scores, and the regression harness
   (`npm run test:breed-matcher`) asserts the documented behaviour on them.

   ⚠️ PLAIN JS ON PURPOSE — no TypeScript, no imports from src/data/*.ts. The node
   test harness imports this module directly, and node cannot load a .ts module.

   Scale 1–5 unless noted. Crossbreed traits vary; treat as a guide.
     size       1 toy · 2 small · 3 medium · 4 large · 5 giant
     energy     1 couch  →  5 tireless working drive
     spaceNeed  1 flat-fine  →  5 needs real room/access
     aloneTol   1 needs company (prone to separation issues)  →  5 independent
     novice     1 experienced handlers only  →  5 ideal first dog
     groom      1 wash-and-go  →  5 high professional grooming
     shed       1 minimal  →  5 heavy
     lowAllergen  true = coat reasonably allergy-friendly
     kids       1 not suited to toddlers  →  5 excellent with young children
     guard      1 no guarding instinct  →  5 strong protective/guarding drive
     bark       1 quiet  →  5 very vocal
     train      1 stubborn/hard  →  5 eager & easy
   =========================================================================== */

/** Positional helper — keeps the dataset readable at 96 rows. */
export const B = (name, group, size, energy, spaceNeed, aloneTol, novice, groom, shed, lowAllergen, kids, guard, bark, train) =>
  ({ name, group, size, energy, spaceNeed, aloneTol, novice, groom, shed, lowAllergen, kids, guard, bark, train });

export const BREEDS = [
/* Gundogs */
B("Labrador Retriever","Gundog",4,4,3,3,5,2,4,false,5,2,2,5),
B("Golden Retriever","Gundog",4,4,3,3,5,3,4,false,5,2,2,5),
B("English Cocker Spaniel","Gundog",3,4,3,3,4,3,3,false,4,2,3,4),
B("Working Cocker Spaniel","Gundog",3,5,4,2,2,3,3,false,4,2,3,4),
B("English Springer Spaniel","Gundog",3,5,4,2,3,3,3,false,4,2,3,4),
B("Sprocker Spaniel","Gundog (cross)",3,5,4,2,3,3,3,false,4,2,3,4),
B("Flat-Coated Retriever","Gundog",4,4,4,3,3,3,4,false,4,2,2,4),
B("Hungarian Vizsla","Gundog",4,5,4,1,2,1,3,false,4,2,2,4),
B("Weimaraner","Gundog",4,5,4,1,2,1,3,false,3,3,3,3),
B("German Shorthaired Pointer","Gundog",4,5,4,2,2,1,3,false,4,2,2,4),
B("Pointer","Gundog",4,5,4,2,2,1,2,false,4,2,2,3),
B("Irish Setter","Gundog",4,5,4,2,3,3,3,false,4,1,2,3),
B("Brittany","Gundog",3,5,4,2,3,2,3,false,4,2,2,4),
B("Nova Scotia Duck Tolling Retriever","Gundog",3,5,4,2,2,3,4,false,4,2,3,4),
B("Chesapeake Bay Retriever","Gundog",4,4,4,3,2,2,4,false,3,3,2,3),

/* Pastoral / herding */
B("Border Collie","Pastoral",3,5,4,2,2,3,4,false,4,2,3,5),
B("Rough Collie","Pastoral",4,3,3,3,4,4,4,false,5,2,3,4),
B("Shetland Sheepdog","Pastoral",2,3,2,3,4,4,4,false,4,2,4,5),
B("German Shepherd","Pastoral",4,4,4,3,2,3,5,false,4,5,3,5),
B("Old English Sheepdog","Pastoral",4,3,3,3,3,5,4,false,4,2,2,3),
B("Australian Shepherd","Pastoral",3,5,4,2,2,3,4,false,4,3,3,5),
B("Pembroke Welsh Corgi","Pastoral",2,3,2,3,3,2,4,false,4,3,4,4),
B("Belgian Malinois","Pastoral",4,5,5,2,1,2,4,false,3,5,3,5),
B("Samoyed","Pastoral",4,4,3,2,3,5,5,false,4,2,4,3),
B("Bearded Collie","Pastoral",4,4,3,3,3,5,4,false,4,2,3,3),

/* Working */
B("Boxer","Working",4,4,3,2,3,1,2,false,4,4,2,3),
B("Rottweiler","Working",5,3,4,3,1,2,3,false,3,5,2,4),
B("Dobermann","Working",4,4,4,2,1,1,2,false,3,5,3,4),
B("Bernese Mountain Dog","Working",5,2,3,3,3,4,5,false,5,3,2,3),
B("Great Dane","Working",5,2,4,3,2,1,3,false,4,3,2,3),
B("Newfoundland","Working",5,2,3,3,3,4,5,false,5,2,2,3),
B("Saint Bernard","Working",5,2,3,3,2,3,4,false,4,3,2,3),
B("Siberian Husky","Working",4,5,5,2,1,3,5,false,4,1,3,2),
B("Alaskan Malamute","Working",5,4,5,2,1,4,5,false,4,2,2,2),
B("Bullmastiff","Working",5,2,3,3,2,1,3,false,3,5,1,3),
B("Mastiff","Working",5,2,4,3,2,1,3,false,3,5,1,3),
B("Leonberger","Working",5,3,4,3,2,4,5,false,4,3,2,3),
B("Cane Corso","Working",5,3,4,3,1,1,3,false,3,5,2,4),
B("Dogue de Bordeaux","Working",5,2,3,3,2,1,3,false,3,4,1,3),
B("Giant Schnauzer","Working",4,4,4,2,1,4,2,true,3,5,3,4),

/* Terriers */
B("Staffordshire Bull Terrier","Terrier",3,4,2,2,3,1,3,false,5,2,2,4),
B("Jack Russell Terrier","Terrier",2,5,3,2,2,2,3,false,3,2,4,3),
B("Parson Russell Terrier","Terrier",2,5,3,2,2,2,3,false,3,2,4,3),
B("Patterdale Terrier","Terrier",2,5,3,2,2,1,2,false,3,2,4,3),
B("Border Terrier","Terrier",2,4,2,3,4,3,2,false,4,2,3,4),
B("West Highland White Terrier","Terrier",2,3,2,3,4,4,2,false,4,2,4,3),
B("Cairn Terrier","Terrier",2,4,2,3,3,3,2,false,4,2,4,3),
B("Scottish Terrier","Terrier",2,3,2,3,3,4,2,false,3,3,3,2),
B("Bull Terrier","Terrier",3,4,3,2,2,1,2,false,3,3,2,3),
B("Airedale Terrier","Terrier",4,4,3,3,2,4,2,true,4,4,3,4),
B("Wire Fox Terrier","Terrier",2,4,3,3,2,3,2,false,4,3,4,3),
B("Bedlington Terrier","Terrier",3,4,3,3,3,4,1,true,4,2,3,3),

/* Hounds */
B("Beagle","Hound",3,4,3,2,3,2,3,false,5,1,4,2),
B("Whippet","Hound",3,3,3,3,4,1,2,false,4,1,1,3),
B("Greyhound","Hound",4,2,3,4,4,1,2,false,4,1,1,3),
B("Miniature Dachshund","Hound",1,3,1,2,3,2,3,false,3,2,4,2),
B("Standard Dachshund","Hound",2,3,2,2,3,2,3,false,3,2,4,2),
B("Basset Hound","Hound",3,2,2,3,3,2,4,false,4,1,3,2),
B("Rhodesian Ridgeback","Hound",4,4,4,3,2,1,2,false,4,4,2,3),
B("Afghan Hound","Hound",4,4,4,3,2,5,2,false,3,1,2,2),
B("Basenji","Hound",2,4,3,3,1,1,2,false,3,2,1,2),
B("Bloodhound","Hound",5,4,4,3,2,2,3,false,4,1,3,2),
B("Irish Wolfhound","Hound",5,3,4,3,3,3,3,false,4,1,1,3),
B("Saluki","Hound",4,4,4,3,2,2,2,false,3,1,2,2),

/* Toy */
B("Chihuahua","Toy",1,3,1,2,3,1,2,false,2,2,4,3),
B("Pug","Toy",2,2,1,2,4,2,4,false,5,1,2,3),
B("Cavalier King Charles Spaniel","Toy",2,3,1,2,5,3,3,false,5,1,2,4),
B("King Charles Spaniel","Toy",1,2,1,2,4,3,3,false,4,1,2,3),
B("Pomeranian","Toy",1,3,1,2,3,4,4,false,3,2,4,3),
B("Yorkshire Terrier","Toy",1,3,1,2,3,4,1,true,3,2,4,3),
B("Maltese","Toy",1,2,1,2,4,4,1,true,3,1,3,3),
B("Papillon","Toy",1,3,1,2,3,3,2,false,3,1,3,5),
B("Italian Greyhound","Toy",1,3,1,2,3,1,1,false,3,1,2,2),
B("Havanese","Toy",1,3,1,2,4,4,1,true,4,1,3,4),

/* Utility */
B("French Bulldog","Utility",2,2,1,2,4,1,3,false,4,2,2,3),
B("Bulldog","Utility",3,1,1,3,4,2,3,false,4,2,1,2),
B("Boston Terrier","Utility",2,3,1,2,4,1,2,false,4,1,2,4),
B("Standard Poodle","Utility",4,4,3,3,3,5,1,true,4,2,2,5),
B("Miniature Poodle","Utility",2,3,2,3,4,5,1,true,4,2,3,5),
B("Toy Poodle","Utility",1,3,1,2,4,5,1,true,3,1,3,5),
B("Dalmatian","Utility",4,5,4,2,2,2,5,false,4,3,2,3),
B("Shih Tzu","Utility",1,2,1,3,4,5,1,true,4,1,2,3),
B("Lhasa Apso","Utility",2,2,1,3,3,5,1,true,3,3,3,3),
B("Tibetan Terrier","Utility",3,3,2,3,3,4,1,true,4,2,3,3),
B("Standard Schnauzer","Utility",3,4,3,3,3,4,1,true,4,4,3,4),
B("Miniature Schnauzer","Utility",2,4,2,3,4,4,1,true,4,3,4,4),
B("Bichon Frise","Utility",1,3,1,2,4,5,1,true,4,1,3,4),
B("Akita","Utility",5,3,4,3,1,3,5,false,3,5,2,3),
B("Shar Pei","Utility",3,2,2,3,2,2,3,false,3,4,2,3),
B("Chow Chow","Utility",4,2,2,4,1,4,5,false,2,5,2,2),
B("Japanese Shiba Inu","Utility",3,3,3,4,1,2,4,false,3,3,2,2),

/* Popular crosses — traits vary widely, shown as a guide */
B("Cockapoo","Cross",2,4,2,2,4,4,1,true,5,1,3,4),
B("Cavapoo","Cross",1,3,1,2,4,4,1,true,5,1,2,4),
B("Labradoodle","Cross",4,4,3,3,4,4,2,true,5,2,2,4),
B("Goldendoodle","Cross",4,4,3,3,4,4,2,true,5,2,2,4),
B("Cavachon","Cross",1,3,1,2,4,3,2,false,5,1,2,4)
];

/* ===========================================================================
   THE QUIZ — 10 single questions, one per screen.
   The `access` question is load-bearing for the space nuance (effectiveSpace):
   the constraint is home MINUS access, not the postcode. Don't merge it into
   `home` (dev-kit brief §9).
   =========================================================================== */
export const QUESTIONS = [
 {id:"home",type:"single",title:"Where will your dog call home?",help:"Be realistic about your everyday setup.",opts:[
   {v:"flat",label:"A flat, or no garden"},
   {v:"smallGarden",label:"A house with a small garden"},
   {v:"largeGarden",label:"A house with a large garden or land"}]},
 {id:"access",type:"single",title:"What exercise space can you actually get to?",help:"Not where you live — where you can realistically take a dog, day to day.",opts:[
   {v:"parksOnly",label:"Local parks and pavements only"},
   {v:"natureNearby",label:"Beaches or open countryside nearby"},
   {v:"willTravel",label:"I’d happily travel or hire a secure field"},
   {v:"privateLand",label:"Large private land at home"}]},
 {id:"exercise",type:"single",title:"How much exercise can you commit to, most days?",opts:[
   {v:"gentle",label:"Gentle strolls"},
   {v:"moderate",label:"Moderate — around an hour"},
   {v:"active",label:"Very active — two hours or more"},
   {v:"working",label:"I want a working-level companion"}]},
 {id:"alone",type:"single",title:"How long will your dog be alone on a typical day?",opts:[
   {v:"rarely",label:"Rarely — someone’s usually home"},
   {v:"fewHours",label:"A few hours"},
   {v:"mostDay",label:"Most of the working day"}]},
 {id:"experience",type:"single",title:"How much dog experience do you have?",opts:[
   {v:"first",label:"First-time owner"},
   {v:"some",label:"I’ve owned dogs before"},
   {v:"expert",label:"Very experienced"}]},
 {id:"grooming",type:"single",title:"How much grooming are you up for?",opts:[
   {v:"minimal",label:"Minimal — wash and go"},
   {v:"brush",label:"Happy to brush regularly"},
   {v:"professional",label:"Happy to use a professional groomer"}]},
 {id:"coat",type:"single",title:"Any feelings about coat and allergies?",opts:[
   {v:"sheddingFine",label:"Shedding is fine"},
   {v:"preferLowShed",label:"I’d prefer low-shedding"},
   {v:"needHypoallergenic",label:"Someone in the home has a real allergy"}]},
 {id:"household",type:"multi",title:"Who’s at home?",help:"Tick all that apply.",opts:[
   {v:"youngKids",label:"Young children or toddlers"},
   {v:"olderKids",label:"Older children"},
   {v:"adultsOnly",label:"Adults only"},
   {v:"otherPets",label:"Other dogs or pets"}]},
 {id:"sizePref",type:"single",title:"Any size preference?",opts:[
   {v:"any",label:"Happy with any size"},
   {v:"small",label:"Smaller"},
   {v:"medium",label:"Medium"},
   {v:"large",label:"Large or giant"}]},
 {id:"barking",type:"single",title:"How do you feel about barking?",opts:[
   {v:"quiet",label:"I’d prefer a quiet dog"},
   {v:"some",label:"Some barking is fine"},
   {v:"fine",label:"Barking doesn’t bother me"}]}
];
