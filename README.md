#Healy's Living Story Markov Gen

## Link
[Click here!](https://jsfiddle.net/9vxLu8tb/6/embedded/result/)

## Background
Hi! A while ago I made an Asuran invention/letter creator ([here](newms34.github.io/asurainv/)).
This time, while exploring the GW2 API (which is... actually surprisingly good), I realized that Living Story episodes are actually stored with full, Markov-Chainable descriptions. So I decided to run a Markov Chain on them. 

## Markov Explanation
A Markov chain is a particular type of very simple 'predicition' algorithm. Basically, it works as follows:

1. Take a sample of text. For example, the Declaration of Independence. 
2. Write down a list of every *unique* word in that text sample. 
3. For each word, build up a frequency list of the words immediately *following* that word. So if the word we're doing is 'in' (and we *are* using the Declaration of Independence), our frequency list might look like (abbreviated): `the:7, such:1, direct:1, their:1, times: 1`. So most of the time, the word 'in' is followed by the word 'the'. 
4. To generate a sample, pick a random 'seed' word. 
5. Pick a random word from that word's frequency list, weighted towards more 'popular' words. 

A larger sample is generally more 'accurate'. In addition, due to the weird nature of how English punctuation works, I've elected not to include punctuation (except, optionally, periods). 

## FAQ

1. *Why don't the blurbs make any sense?*
 - This text is auto-generated, and the sample given is actually rather small. As such, most words' frequency lists aren't specific enough to actually generate any degree of accuracy.

2. *Can't you make it more accurate?*
 - Not without compromising the veracity of the inputted data. Either that, or I'd need additional sources of gw2 lore 'text'. I've included the Asura version of the story blurbs from the personal story - more to come!