/**
 * User Story
 * 
 * Malone wants a humorous gimmick for his customers
 * It should ask yes / no questions in a particular sequence  
 * And always ultimately conclude with a reply that ends with the participator going to Malones
 *  
 */

/**
 * Spec
 * 
 * Start with "Should you come into Malones?"
 * Ask 6 questions
 * For each question, the answer "yes" ends with the same reply -  "Well then come in so!"
 * For each question except the last the answer "no" asks the next question in the sequence
 * For the last question the answer no ends with another reply - "Maybe a pint will cheer you up ya miserable git! Come in!"
 * Once the user has answered yes the game is over
 * 
 */

/**
 * Interface -
 * 
 * Something gives the user a response
 * Something that has a yes and no option
 * Something that starts the "game"
 * 
 * Data -
 * 
 * All the questions
 * The two replies
 * Question number 
 * 
 * Logic -
 * 
 * For any question respond with the first reply if user answers yes
 * If not last question respond with another question if user answers no
 * If last question respond with the second reply if user answers no
 * 
 */

// const malones = {
//     questions: [
//         "Should you come into Malones?",
//         "Are you Irish?",
//         "Do you want to be?",
//         "Well, do you like music",
//         "Pizza?",
//         "Ice cream?",
//         "Awesome service?"
//     ],
//     replies: [
//         "Well then come in so!",
//         "Maybe a pint will cheer you up ya miserable git! Come in!"
//     ],
//     questionNumber: 0,
//     start() {
//         return this.questions[this.questionNumber];
//     },
//     yes() {
//         return this.replies[0];
//     },
//     no() {
//         if(this.questionNumber === this.questions.length - 1) {
//             return this.replies[1];
//         }
//         this.questionNumber++;
//         return this.questions[this.questionNumber];
//     }
// };

function malones() {
    return {
        questions: [
            "Should you come into Malones?",
            "Are you Irish?",
            "Do you want to be?",
            "Well, do you like music",
            "Pizza?",
            "Ice cream?",
            "Awesome service?"
        ],
        replies: [
            "Well then come in so!",
            "Maybe a pint will cheer you up ya miserable git! Come in!"
        ],
        questionNumber: 0,
        start() {
            return this.questions[this.questionNumber];
        },
        yes() {
            return this.replies[0];
        },
        no() {
            if(this.questionNumber === this.questions.length - 1) {
                return this.replies[1];
            }
            this.questionNumber++;
            return this.questions[this.questionNumber];
        }
    }
}

module.exports = malones;