// varubles
let strCurrentPage = "mainPage";
let strFormerPage = "mainPage";
var strCurrentTopic_recipePage = "salads";
var strCurrentTopic_videosPage = "recipe";
var strCurrentTopic_galleryPage = "recipe";
var strCurrentTopic_learningPage = "subject1";
let nCurrentTopicNumber = 0;
let currentPicNum;
let currentPicName;
let currTopic;


/* loading function
--------------------------------------------------------------
Description: */
window.addEventListener(`load`, () => {
    document.querySelector(`.loader`).classList.add(`fade`);
    let arrMainPageButtons = document.querySelectorAll('.mainPageButton');
    for (let i = 0; i < arrMainPageButtons.length; i++) {
        arrMainPageButtons[i].addEventListener('click', showPage);
    };
    showNavBar();
    document.querySelector(`.recipesScrollContainer`).addEventListener('swiped', checkSwipeDirection);
    document.querySelector(`.videosScrollContainer`).addEventListener('swiped', checkSwipeDirection);
    document.querySelector(`.learningScrollContainer`).addEventListener('swiped', checkSwipeDirection);
    document.querySelector(`.galleryScrollContainer`).addEventListener('swiped', checkSwipeDirection);
    document.querySelector(`#credits`).addEventListener('click', credits);
});

/* showPage
--------------------------------------------------------------
Description:  */
const showPage = (event) => {
    // מעלים דיב קודם שומר דיב נוכחי ומראה אותו
    document.querySelector(`.${strCurrentPage}`).classList.add("hidden");
    if (event.currentTarget.classList[1] !== "x") {   // מטפל במקרה של תפריט
        if (strCurrentPage === "menuPage") {
            document.querySelector(`.${strCurrentPage}`).classList.add("hidden");
            strCurrentPage = `${event.currentTarget.classList[2]}Page`;
        } else {
            strFormerPage = strCurrentPage;
            strCurrentPage = event.currentTarget.classList[1] + "Page";
        }
    } else {
        strCurrentPage = strFormerPage;
    }
    document.querySelector(`.${strCurrentPage}`).classList.remove("hidden");
    // מראה תפריט עליון
    showNavBar();
    // שומר קטגוריה נוכחית
    if (event.currentTarget.classList[0] === "menuDropDownItemContainer") {
        window[`strCurrentTopic_${strCurrentPage}`] = event.currentTarget.classList[1];
    }
    // מראה בר תחתון
    if (PAGES[strCurrentPage].bottomNavBar) {
        let nNumberTheSymbols = 0; 
        document.querySelector(`.${strCurrentPage} .bottomNavBar`).innerHTML = "";
        for (let key of Object.keys(PAGES[strCurrentPage].bottomNavBar)) {
            let bottomNavBarTopic = El("div", 
            {attributes: {class: `bottomNavBarTopic ${key} ${nNumberTheSymbols}`}, 
            listeners : {click : showTopics}},
            El ("img", {attributes: {class : "bottomNavBarPic" , src: `../assets/images/grapics/bottomNavBar/${PAGES[strCurrentPage].bottomNavBar[key][1]}.svg`}}),
            El ("div", {cls: "bottomNavBarText"}, PAGES[strCurrentPage].bottomNavBar[key][0])
            );
            document.querySelector(`.${strCurrentPage} .bottomNavBar`).append(bottomNavBarTopic);
            nNumberTheSymbols++;
        }
        document.querySelector(`.${strCurrentPage} .bottomNavBar .${eval(`strCurrentTopic_${strCurrentPage}`)}`).classList.add("bold");
        document.querySelector(`.${strCurrentPage} .bottomNavBar`).scrollLeft = 0;
        document.querySelector(`.${strCurrentPage} .bottomNavBar`).scrollLeft = PAGES[strCurrentPage].bottomNavBar[eval(`strCurrentTopic_${strCurrentPage}`)][2];
    }
    // קורא לפונקציות אם צריך
    if (PAGES[strCurrentPage].functions) {
        for (let i = 0; i < PAGES[strCurrentPage].functions.length; i++) {
            eval(PAGES[strCurrentPage].functions[i]);
        }
    }
    // שם מאזינים אם צריך
    if (PAGES[strCurrentPage].listeners) {
        for (key of Object.keys(PAGES[strCurrentPage].listeners)) {
            document.querySelector(`.${strCurrentPage} .${key}`).addEventListener('click', eval(PAGES[strCurrentPage].listeners[key]));
        }
    }
    if(document.querySelector(`.recipeContent`)) {
        let recipeContent = document.querySelector(`.recipeContent`);
        document.querySelector(`.recipePage`).removeChild(recipeContent);
    }
}

/* showRecipe
--------------------------------------------------------------
Description:  */
const showRecipe = (event) => {
    // שומר מתכון וקטגוריה נוכחיים
    let strCurrentRecipe = event.currentTarget.classList[1];
    if(event.currentTarget.classList[2]) {
        strCurrentTopic_recipePage = event.currentTarget.classList[2];
    }
    // אם באים מחיפוש
    if (document.querySelector('.searchScreen').classList[2] === undefined || strCurrentPage === "galleryPage") {
        document.querySelector('.searchScreen').classList.add("hidden");
        // מעלים דיב קודם שומר דיב נוכחי ומראה אותו
        document.querySelector(`.${strCurrentPage}`).classList.add("hidden");
        strCurrentPage = "recipePage";
        document.querySelector(`.${strCurrentPage}`).classList.remove("hidden");
        // מראה תפריט עליון
        showNavBar();
    }
    // מרוקן דיבים
    document.querySelector(`.recipesScrollContainer`).innerHTML = "";
    document.querySelector(`.${strCurrentPage} .bottomNavBar`).innerHTML = "";
    if(document.querySelector(`.recipeContent`)) {
        let recipeContent = document.querySelector(`.recipeContent`);
        document.querySelector(`.recipePage`).removeChild(recipeContent);
    }
    // יוצר מתכון ומכניס לדף
    let recipeContent = El("div", {cls : "recipeContent"},
        El("img", 
        {attributes: {class: `recipeContentPic`, 
        src : `../assets/images/foodImages/${strCurrentTopic_recipePage}/${PAGES[strCurrentPage].content[strCurrentTopic_recipePage][strCurrentRecipe].pic}.jpeg`}}),
        El("div", {cls : "recipeContentHeadline"}, addSpace(strCurrentRecipe)),
        El("div", {cls : "recipeContentDescription"}, PAGES[strCurrentPage].content[strCurrentTopic_recipePage][strCurrentRecipe].description),
        El("div", {cls: "recipeInfoConteiner"}, // מידע על המנה
            El("div", {classes: ["headers", "quantity"]},
                El("div", {cls: "headerContainer"},
                    El("img",{attributes: {class: `recipeInfoPics`, 
                    src : `../assets/images/grapics/recipe/serving_size_icon.svg`}}),
                    "כמות:",
                ),
                El("div", {cls: "recipeInfoText"},  PAGES[strCurrentPage].content[strCurrentTopic_recipePage][strCurrentRecipe].quantity)
            ),
            El("div", {cls: "headers"},
                El("div", {cls: "headerContainer"},
                    El("img",{attributes: {class: `recipeInfoPics`, 
                    src : `../assets/images/grapics/recipe/timer.svg`}}),
                    "זמן הכנה:",
                ),
                El("div", {cls: "recipeInfoText"},  PAGES[strCurrentPage].content[strCurrentTopic_recipePage][strCurrentRecipe].time)
            ),
        ),
        El("div", {cls : "ingredientsContainer"},
            El("div", {cls : "recipeContentIngredientHead"}, "מצרכים"),
        ),
        El("div", {cls : "preparationsContainer"},
            El("div", {cls : "recipeContentIngredientHead"}, "אופן הכנה"),
        ),
    );
    document.querySelector(`.recipePage`).append(recipeContent);
    // מוסיף קישור לסרטון אם יש
    if(PAGES[strCurrentPage].content[strCurrentTopic_recipePage][strCurrentRecipe].video) {
        let videoLink =  El("a", {attributes: {class: "recipePageToVideoButton", href: `https://www.youtube.com/watch?v=${PAGES[strCurrentPage].content[strCurrentTopic_recipePage][strCurrentRecipe].video}`}},"לצפייה בסרטון");
        document.querySelector(`.recipeContentDescription`).append(videoLink);
    }
    // מכניס מצרכים
    for (let i = 0; i < PAGES[strCurrentPage].content[strCurrentTopic_recipePage][strCurrentRecipe].ingredients.length; i++ ) {
        let ingredient = El("div", {cls : "ingredientContainer"},
        El("img",{attributes: {class: `ingredientCheckPic ingredientCheckPic${i}`, 
        src : `../assets/images/grapics/recipe/checkbox_blank.svg`},
        listeners : {click: onClickCheckBox}}),
        PAGES[strCurrentPage].content[strCurrentTopic_recipePage][strCurrentRecipe].ingredients[i]
        );
        document.querySelector(`.ingredientsContainer`).append(ingredient);
    }
    // מכניס אופן הכנה
    for (let i = 0; i < PAGES[strCurrentPage].content[strCurrentTopic_recipePage][strCurrentRecipe].preparation.length; i++ ) {
        let preparation = El("div", {cls : "preparationContainer"},
        El("img",{attributes: {class: `preparationCheckPic preparationCheckPic${i} gray`, 
        src : `../assets/images/grapics/recipe/round_checkbox.svg`},
        listeners : {click: onClickCheckBox}}),
        PAGES[strCurrentPage].content[strCurrentTopic_recipePage][strCurrentRecipe].preparation[i]
        );
        document.querySelector(`.preparationsContainer`).append(preparation);
    }
    
    // כפתור חזור
    document.querySelector(`.button_menu`).setAttribute("src", "../assets/images/grapics/general/right_arrow.svg");
    document.querySelector(`.button_menu`).classList.remove("menu");
    if (event.currentTarget.classList[0] === "galleryToRecipe") {
        document.querySelector(`.button_menu`).classList.add("gallery");
    } else {
        document.querySelector(`.button_menu`).classList.add("recipe");
    }
}

/* showTopics
--------------------------------------------------------------
Description: */
const showTopics = (event) => {
    // שם מאזינים להחלקה ושומר את הקטגוריות במערך
    let arrTopic = [];
    for (let topics of Object.keys(PAGES[strCurrentPage].content)) {
        arrTopic.push(topics);
    }

    currTopic = eval(`strCurrentTopic_${strCurrentPage}`)

    // מוריד בולד לקטגוריה הקודמת, שומר קטגוריה נוכחית ושם עליה בולד
    document.querySelector(`.${strCurrentPage} .${currTopic}`).classList.remove("bold");
    document.querySelector(`.${strCurrentPage} .${currTopic} .bottomNavBarPic`).style.height = "5vh";
    if(event) { // בודק אם נעשתה לחיצה או החלקה
        if (event.currentTarget.classList[0] === "bottomNavBarTopic") { 
            document.querySelector(`.recipesScrollContainer`).scrollTop = 0;
            // בלחיצה שומר קטגוריה נוכחית ואת מספרה
            currTopic = event.currentTarget.classList[1];
            nCurrentTopicNumber = Number(event.currentTarget.classList[2]);
        } else {
            // בהחלקה בודק לאיזה כיוון ההחלקה ומשנה קטגוריה בהתאם
            if(event.detail.dir === "left" && nCurrentTopicNumber > 0) {
                document.querySelector(`.recipesScrollContainer`).scrollTop = 0;
                nCurrentTopicNumber--;
            } else if (event.detail.dir === "right" && nCurrentTopicNumber < Object.keys(PAGES[strCurrentPage].bottomNavBar).length -1) {
                document.querySelector(`.recipesScrollContainer`).scrollTop = 0;
                nCurrentTopicNumber++;
            }
            currTopic = arrTopic[nCurrentTopicNumber];
        }
    } else { // שומר את מספר הקטגוריה אם באים מהתפריט או מההתחלה
        nCurrentTopicNumber = Number(document.querySelector(`.${strCurrentPage} .${currTopic}`).classList[2]);
    }

    document.querySelector(`.${strCurrentPage} .bottomNavBar`).scrollLeft = PAGES[strCurrentPage].bottomNavBar[currTopic][2];

    document.querySelector(`.${strCurrentPage} .${currTopic}`).classList.add("bold");
    document.querySelector(`.${strCurrentPage} .${currTopic} .bottomNavBarPic`).style.height = "6vh";
    
    eval(`createTopic_${strCurrentPage}(currTopic)`);
}

/* createTopic_recipePage
--------------------------------------------------------------
Description: */
const createTopic_recipePage = (currTopic) => {
    strCurrentTopic_recipePage = currTopic
    // מוחק מידע קודם ומכניס תמונות וטקסט בהתאם לקטגוריה
    document.querySelector(`.recipesScrollContainer`).innerHTML = "";

    for(let key of Object.keys(PAGES[strCurrentPage].content[strCurrentTopic_recipePage])) {
        let recipeDisplay = El("div",
        {attributes: {class: `recipeDisplay ${key}`}, 
        listeners : {click : showRecipe}},
            El("img",
            {attributes: {class: `recipeDisplayPic`, 
            src : `../assets/images/foodImages/${strCurrentTopic_recipePage}/${PAGES[strCurrentPage].content[strCurrentTopic_recipePage][key].pic}.jpeg`},}),
            El("div", {cls: `recipeDisplayText`}, addSpace(key))
        )
        document.querySelector(`.recipesScrollContainer`).append(recipeDisplay)
    }
}

/* createTopic_learningPage
--------------------------------------------------------------
Description: */
const createTopic_learningPage = (currTopic) => {
    strCurrentTopic_learningPage = currTopic
    // מוחק מידע קודם ומכניס תמונות וטקסט בהתאם לקטגוריה
    document.querySelector(`.learningScrollContainer`).innerHTML = "";
    for(let key of Object.keys(PAGES[strCurrentPage].content[strCurrentTopic_learningPage])) {
        let menuDisplay = El("div",{ classes: [`learningContainer`, key]},
            El("div",
                {attributes: {class: `learningItem ${key}`},
                listeners : {click : learningDropDown}}, 
                    El("div", {classes: [`learningItemContainer`,"container", key],}, 
                        addSpace(key)
                    ),
                    El("img",
                        {attributes: {class: `learningItemArrow ${key}`, 
                        src : `../assets/images/grapics/menu/dropdown_sideArrow.svg`}}),
            )
        )
        document.querySelector(`.learningScrollContainer`).append(menuDisplay)
    }
}

/* menuDropDown
--------------------------------------------------------------
Description:  */
const learningDropDown = (event) => {
    let currentTopic = event.currentTarget.classList[1];
    let objCurrentDropDown = PAGES.learningPage.content[strCurrentTopic_learningPage][currentTopic];
    // מראה דרופ דאון
    if (document.querySelector(`.learningPage .${currentTopic} .learningItem `).lastChild.getAttribute("src") === "../assets/images/grapics/menu/dropdown_sideArrow.svg") {
        document.querySelector(`.learningPage .${currentTopic} .learningItem `).lastChild.setAttribute("src", "../assets/images/grapics/menu/opened_dropdown.svg");
        for(let key of Object.keys(objCurrentDropDown)) {
            let menuDropDown = 
                El("div", {classes: [`learningDropDownItemContainer`, key, currentTopic],
                listeners : {click : showLearningContent}}, 
                    // El("img",
                    // {attributes: {class: `menuDropDownItemicon`, 
                    // src : `../assets/images/grapics/menu/${objCurrentDropDown[key][1]}.svg`},}),
                    addSpace(key),
                );
            document.querySelector(`.learningPage .${currentTopic}`).append(menuDropDown)
        }
    } else { // מעלים דרופ דאון
        document.querySelector(`.learningPage .${currentTopic} > .learningItem`).lastChild.setAttribute("src", "../assets/images/grapics/menu/dropdown_sideArrow.svg");
        let arrDropDownItems = document.querySelectorAll(`.learningPage .${currentTopic} .learningDropDownItemContainer`);
        for (let i = 0; i < arrDropDownItems.length; i++) {
            document.querySelector(`.learningPage .${currentTopic}`).removeChild(arrDropDownItems[i]);
        };
    }

}


/* showLearningContent
--------------------------------------------------------------
Description: */
const showLearningContent = (event) => {
    let subjectTitle = event.currentTarget.classList[1];
    let topic = event.currentTarget.classList[2];
    let subjectContent = PAGES[strCurrentPage].content[strCurrentTopic_learningPage][topic][subjectTitle];
    // כפתור חזור
    document.querySelector(`.button_menu`).setAttribute("src", "../assets/images/grapics/general/right_arrow.svg");
    document.querySelector(`.button_menu`).classList.remove("menu");
    document.querySelector(`.button_menu`).classList.add("learning");
    // מרוקן דיב ומאפס סקרול
    document.querySelector(`.learningScrollContainer`).innerHTML = "";
    document.querySelector(`.${strCurrentPage} .bottomNavBar`).innerHTML = "";
    document.querySelector(`.learningScrollContainer`).scrollTop = 0;
    let content = El("div", {cls: "learningContantContainer"},
        El("div", {cls: "learningContantTitle"}, addSpace(subjectTitle)), );
    let container;
    document.querySelector(`.learningScrollContainer`).append(content);
    switch (subjectContent.type) {
        case 'text':
            container =  El("div", {cls: "learningContant"},);
            document.querySelector(`.learningContantContainer`).append(container);
            for(let i = 0; i < subjectContent.content.length; i++){
                let parah = El("div", {cls : "IdParah"}, );
                parah.innerHTML = subjectContent.content[i];
                document.querySelector(`.learningContant`).append(parah); 
            }
            break;
        case 'listDots': 
            container =  El("ul", {cls: "learningContant"},);
            document.querySelector(`.learningContantContainer`).append(container);
            for(let i = 0; i < subjectContent.content.length; i++){
                let parah = El("li", {cls : "listItem"},);
                parah.innerHTML = subjectContent.content[i];
                document.querySelector(`.learningContant`).append(parah); 
            }
            break;
        case 'listNumbers':
            container =  El("ol", {cls: "learningContant"},);
            document.querySelector(`.learningContantContainer`).append(container);
            for(let i = 0; i < subjectContent.content.length; i++){
                let parah = El("li", {cls : "listItem"},);
                parah.innerHTML = subjectContent.content[i];
                document.querySelector(`.learningContant`).append(parah); 
            }
            break;
        case 'textAndPics':
            container =  El("div", {cls: "learningContant"},);
            document.querySelector(`.learningContantContainer`).append(container);
            for(let i = 0; i < subjectContent.content.length; i++){
                let parah = El("div", {cls : "IdParah"},);
                parah.innerHTML = subjectContent.content[i];
                document.querySelector(`.learningContant`).append(parah); 
            }
            container = El("div", {cls: "idPicContainer"});
            document.querySelector(`.learningContantContainer`).append(container);
            for(let i = 0; i < subjectContent.pic.length; i++){
                let parah = El("img", {cls : "picId", attributes : {src : subjectContent.pic[i]}});
                document.querySelector(`.idPicContainer`).append(parah); 
            }
            break;
        default: console.log("default");
    }
}


/* createTopic_videosPage
--------------------------------------------------------------
Description: */
const createTopic_videosPage = (currTopic) => {
    strCurrentTopic_videosPage = currTopic
    // מוחק מידע קודם ומכניס תמונות וטקסט בהתאם לקטגוריה
    document.querySelector(`.videosScrollContainer`).innerHTML = "";
    for(let key of Object.keys(PAGES[strCurrentPage].content[strCurrentTopic_videosPage])) {
        let menuDisplay = El("div",{ classes: [`learningContainer`, key]},
            El("div",
                {attributes: {class: `learningItem ${key}`},
                listeners : {click : videoDropDown}}, 
                    El("div", {classes: [`learningItemContainer`,"container", key],}, 
                        addSpace(key)
                    ),
                    El("img",
                        {attributes: {class: `learningItemArrow ${key}`, 
                        src : `../assets/images/grapics/menu/dropdown_sideArrow.svg`}}),
            )
        )
        document.querySelector(`.videosScrollContainer`).append(menuDisplay)
    }

    // למחוק כשמוסיפים סרטוני בטיחות וברהצ
    if(strCurrentTopic_videosPage !== "recipe") {
        let soon = El("div", {},
            El("img", {id: "soonImg", attributes: {src: "../assets/images/grapics/videos/gear.svg"}}),
            El("div", {id: "soonText"}, "עובדים על זה...")
        )
        document.querySelector(`.videosScrollContainer`).append(soon);
    }
}

/* videoDropDown
--------------------------------------------------------------
Description:  */
const videoDropDown = (event) => {
    let currentTopic = event.currentTarget.classList[1];
    let objCurrentDropDown = PAGES.videosPage.content[strCurrentTopic_videosPage][currentTopic];
    // מראה דרופ דאון
    if (document.querySelector(`.videosPage .${currentTopic} .learningItem `).lastChild.getAttribute("src") === "../assets/images/grapics/menu/dropdown_sideArrow.svg") {
        document.querySelector(`.videosPage .${currentTopic} .learningItem `).lastChild.setAttribute("src", "../assets/images/grapics/menu/opened_dropdown.svg");
        for(let key of Object.keys(objCurrentDropDown)) {
            let videoId = PAGES[strCurrentPage].content[strCurrentTopic_videosPage][currentTopic][key]
            let videoDisplay = El("div",
                {classes: [`youtubeVideoContainer`, key],},
                El("div", {cls: `videosDisplayText`}, addSpace(key)),
            );
            let thumbnail = El("a",
                {cls: "videoPageVideoThumbnail",
                attributes: {
                    href: `https://www.youtube.com/watch?v=${videoId}`,
                    id: videoId,
                    "data-index": key,
                    "data-playlist": currentTopic
            },},)
            thumbnail.style.backgroundImage = `url("http://img.youtube.com/vi/${videoId}/0.jpg")`;
            videoDisplay.prepend(thumbnail);
            document.querySelector(`.videosPage .${currentTopic}`).append(videoDisplay);
        }
    } else { // מעלים דרופ דאון
        document.querySelector(`.videosPage .${currentTopic} > .learningItem`).lastChild.setAttribute("src", "../assets/images/grapics/menu/dropdown_sideArrow.svg");
        let arrDropDownItems = document.querySelectorAll(`.videosPage .${currentTopic} .youtubeVideoContainer`);
        for (let i = 0; i < arrDropDownItems.length; i++) {
            document.querySelector(`.videosPage .${currentTopic}`).removeChild(arrDropDownItems[i]);
        };
    }

}

/* createTopic_galleryPage
--------------------------------------------------------------
Description: change hyphen to space */
const createTopic_galleryPage = (currTopic) => {
    strCurrentTopic_galleryPage = currTopic
    let currentPic = 0;
    // מוחק מידע קודם ומכניס תמונות וטקסט בהתאם לקטגוריה
    document.querySelector(`.galleryScrollContainer`).innerHTML = "";
    if(strCurrentTopic_galleryPage === "recipe") {
        for(let topics of Object.keys(PAGES.recipePage.content)) {
            for(let recipe of Object.keys(PAGES.recipePage.content[topics])) {      
                if(!PAGES[strCurrentPage].content[strCurrentTopic_galleryPage][recipe]) {
                    PAGES[strCurrentPage].content[strCurrentTopic_galleryPage][recipe] = [PAGES.recipePage.content[topics][recipe].pic, topics];
                }
            }
        }
        for(let key of Object.keys(PAGES[strCurrentPage].content[strCurrentTopic_galleryPage])) {
            let recipeDisplay = El("div",
            {attributes: {class: `galleryScrollDisplay ${key} ${currentPic}`}, 
            listeners : {click : showPicDisplay}},
            )
            recipeDisplay.style.backgroundImage = `url(../assets/images/foodImages/${PAGES[strCurrentPage].content[strCurrentTopic_galleryPage][key][1]}/${PAGES[strCurrentPage].content[strCurrentTopic_galleryPage][key][0]}.jpeg)`
            document.querySelector(`.galleryScrollContainer`).append(recipeDisplay);
            currentPic++;
        }
    } else {
        for(let i = 1; i <= 97; i++ ) {
            let recipeDisplay = El("div",
            {attributes: {class: `galleryScrollDisplay pic${i} ${currentPic}`}, 
            listeners : {click : showPicDisplay}},
            )
            recipeDisplay.style.backgroundImage = `url(../assets/images/foodImages/eventGallary/event${i}.jpeg)`
            document.querySelector(`.galleryScrollContainer`).append(recipeDisplay);
            if(!PAGES[strCurrentPage].content[strCurrentTopic_galleryPage][`pic${i}`]) {
                PAGES[strCurrentPage].content[strCurrentTopic_galleryPage][`pic${i}`] = `event${i}`;
            }
            currentPic++;
        }
    }
}

/* showPicDisplay
--------------------------------------------------------------
Description:  */
const showPicDisplay = (event) => {
    const NUMBER_OF_PICTUERS = Object.keys(PAGES[strCurrentPage].content[strCurrentTopic_galleryPage]).length - 1;

    // שם מאזין לרקע להעלמת התצוגה
    document.querySelector(`.galleryPage .darkScreen`).addEventListener("click", () => {
        document.querySelector(`.galleryPicDisplay`).classList.add("hidden");
        document.querySelector(`.galleryPage .darkScreen`).classList.add("hidden");
    });

    // בודק מה נלחץ ומשנה תמונה נוכחית בהתאם
    if(event.currentTarget.classList[0] === "rightArrow") {
        currentPicNum--;
        if (Number(currentPicNum) === -1) {
            currentPicNum = NUMBER_OF_PICTUERS;
        }
    } else if(event.currentTarget.classList[0] === "leftArrow") {
        currentPicNum++;
        if (Number(currentPicNum) === NUMBER_OF_PICTUERS + 1) {
            currentPicNum = 0;
        }
    } else if(event.currentTarget.classList[0] === "galleryScrollDisplay") {
        currentPicNum = event.currentTarget.classList[2];
    }
    // שומר שם של תמונה נוכחית
    currentPicName = Object.keys(PAGES[strCurrentPage].content[strCurrentTopic_galleryPage])[currentPicNum];
    // מראה את תצוגת התמונה ומרוקן אותה
    document.querySelector(`.galleryPage .darkScreen`).classList.remove("hidden");
    document.querySelector(`.galleryPicDisplay`).classList.remove("hidden");
    document.querySelector(`.galleryPicDisplay`).innerHTML = "";
    // יוצר את התצוגה ומכניס לדיב
    if(strCurrentTopic_galleryPage === "recipe"){
        let picDisplay = El("div", {cls : `picDisplayContiner`},
            El("img", 
            {attributes: {class: `galleryDisplayPic`, 
            src : `../assets/images/foodImages/${PAGES[strCurrentPage].content[strCurrentTopic_galleryPage][currentPicName][1]}/${PAGES[strCurrentPage].content[strCurrentTopic_galleryPage][currentPicName][0]}.jpeg`},}),
            El("div", {cls: `galleryDisplayText`}, addSpace(currentPicName)),
            El("div", {cls: "toRecipeButton"}),
            El ("div", {cls: `galleryDisplayArrows`},
                El("img", 
                {attributes: {class: `rightArrow arrow`, 
                src : `../assets/images/grapics/general/right_arrow.svg`},
                listeners : {click : showPicDisplay}}),
                El("img", 
                {attributes: {class: `leftArrow arrow`, 
                src : `../assets/images/grapics/general/left_arrow.svg`},
                listeners : {click : showPicDisplay}}),
            )
        );
        document.querySelector(`.galleryPicDisplay`).append(picDisplay);
        let toRecipe = El("img", {attributes: {class: `galleryToRecipe ${currentPicName} ${PAGES[strCurrentPage].content[strCurrentTopic_galleryPage][currentPicName][1]}`, 
        src : `../assets/images/grapics/general/lamatkon_button.svg`},
        listeners : {click : showRecipe}})
        document.querySelector(`.toRecipeButton`).append(toRecipe);
    } else {
        let picDisplay = El("div", {cls : `picDisplayContiner`},
        El("img", 
        {attributes: {class: `galleryDisplayPic`, 
        src : `../assets/images/foodImages/eventGallary/${PAGES[strCurrentPage].content[strCurrentTopic_galleryPage][currentPicName]}.jpeg`},}),
        // El("div", {cls: `galleryDisplayText`}, addSpace(currentPicName)),
        El("div", {cls: "toRecipeButton"}),
        El ("div", {cls: `galleryDisplayArrows`},
            El("img", 
            {attributes: {class: `rightArrow arrow`, 
            src : `../assets/images/grapics/general/right_arrow.svg`},
            listeners : {click : showPicDisplay}}),
            El("img", 
            {attributes: {class: `leftArrow arrow`, 
            src : `../assets/images/grapics/general/left_arrow.svg`},
            listeners : {click : showPicDisplay}}),
        )
    );
    document.querySelector(`.galleryPicDisplay`).append(picDisplay);  
    }
}

/* onClickCheckBox
--------------------------------------------------------------
Description:  */
const onClickCheckBox = (event) => {
    if (event.currentTarget.classList[0] === "preparationCheckPic") {
        if(event.currentTarget.classList[2] === "gray") {
            document.querySelector(`.${event.currentTarget.classList[1]}`).classList.remove("gray");
        } else {
            document.querySelector(`.${event.currentTarget.classList[1]}`).classList.add("gray");
        }
    } else {
        if (document.querySelector(`.${event.currentTarget.classList[1]}`).getAttribute("src") === `../assets/images/grapics/recipe/checkbox_v.svg`) {
            document.querySelector(`.${event.currentTarget.classList[1]}`).setAttribute("src", `../assets/images/grapics/recipe/checkbox_blank.svg`);
        } else {
            document.querySelector(`.${event.currentTarget.classList[1]}`).setAttribute("src", `../assets/images/grapics/recipe/checkbox_v.svg`);
        }
    }

}

/* showMenu
--------------------------------------------------------------
Description:  */
const showMenu = () => {
    // מוחק מידע קודם ומכניס תמונות וטקסט בהתאם לקטגוריה
    document.querySelector(`.menuPage`).innerHTML = "";
    for(let key of Object.keys(PAGES.menuPage.content)) {
        let menuDisplay = El("div",{classes: [`menuContainer`, key]},
            El("div",
            {classes: [`menuItem`, key],
            listeners : {click : menuDropDown}}, 
                El("div", {classes: [`menuItemContainer`,"container", key],
                listeners : {click : showPage}}, 
                    El("img",
                    {attributes: {class: `menuItemicon`, 
                    src : `../assets/images/grapics/menu/${PAGES.menuPage.content[key][1]}.svg`},}),
                    PAGES.menuPage.content[key][0],
                ),
                El("img",
                    {attributes: {class: `menuItemArrow ${key}`, 
                    src : `../assets/images/grapics/menu/dropdown_sideArrow.svg`}}),
                )
        )
        document.querySelector(`.menuPage`).append(menuDisplay)
    }

}

/* menuDropDown
--------------------------------------------------------------
Description:  */
const menuDropDown = (event) => {
    let currentPage = event.currentTarget.classList[1];
    let objCurrentDropDown = PAGES.menuPage.content[event.currentTarget.classList[1]][2];
    // מראה דרופ דאון
    if (document.querySelector(`.menuPage > .${currentPage} > .menuItem`).lastChild.getAttribute("src") === "../assets/images/grapics/menu/dropdown_sideArrow.svg") {
        document.querySelector(`.menuPage > .${currentPage} > .menuItem`).lastChild.setAttribute("src", "../assets/images/grapics/menu/opened_dropdown.svg");
        for(let key of Object.keys(objCurrentDropDown)) {
            let menuDropDown = 
                El("div", {classes: [`menuDropDownItemContainer`, key, currentPage],
                listeners : {click : showPage}}, 
                    El("img",
                    {attributes: {class: `menuDropDownItemicon`, 
                    src : `../assets/images/grapics/menu/${objCurrentDropDown[key][1]}.svg`},}),
                    objCurrentDropDown[key][0],
                );
            document.querySelector(`.menuPage > .${currentPage}`).append(menuDropDown)
        }
    } else { // מעלים דרופ דאון
        document.querySelector(`.menuPage > .${currentPage} > .menuItem`).lastChild.setAttribute("src", "../assets/images/grapics/menu/dropdown_sideArrow.svg");
        let arrDropDownItems = document.querySelectorAll(`.menuPage > .${currentPage} .menuDropDownItemContainer`);
        for (let i = 0; i < arrDropDownItems.length; i++) {
            document.querySelector(`.menuPage > .${currentPage}`).removeChild(arrDropDownItems[i]);
        };
    }

}

/* onClickSearch
--------------------------------------------------------------
Description:  */
const onClickSearch = () => {
    document.querySelector(`.searchBox`).value = "";
    document.querySelector('.dropDown').innerHTML = "";
    document.querySelector('.searchScreen').classList.remove("hidden");
    document.querySelector(`.closeSearch`).addEventListener('click', () => {
        document.querySelector('.searchScreen').classList.add("hidden");
    });
    if(strCurrentPage === "recipePage") {
        document.querySelector(`.searchBox`).setAttribute("placeholder", "חיפוש מתכון");
    } else if(strCurrentPage === "videosPage"){
        document.querySelector(`.searchBox`).setAttribute("placeholder", "חיפוש סרטון");
    }
    document.querySelector(`.searchBox`).addEventListener("input", window[`onSearch_${strCurrentPage}`]);
}

/* onSearch
--------------------------------------------------------------
Description: cheack for search match and creat dropdown accordingly */
var onSearch_recipePage = () => {
    document.querySelector('.dropDown').innerHTML = "";
    // עובר על כול הקטגוריות של המתכונים
    for (let keys of Object.keys(PAGES[strCurrentPage].content)){
        // בכול קטגוריה, עובר על כול המתכונים ומחפש התאמה לחיפוש
        for (let key of Object.keys(PAGES[strCurrentPage].content[keys])) {
            let strUserInput = document.querySelector(`.searchBox`).value;
            if(addSpace(key).includes(strUserInput) && strUserInput !== ""){
                let dropDownItem = El("div", {classes : ["dropDownItem", key, keys], listeners : {click : showRecipe}}, addSpace(key))
                document.querySelector('.dropDown').append(dropDownItem);
            }
        }
    
    }
}

/* onSearch
--------------------------------------------------------------
Description: cheack for search match and creat dropdown accordingly */
var onSearch_videosPage = () => {
    document.querySelector('.dropDown').innerHTML = "";
    // עובר על כול הקטגוריות של המתכונים
    for (let videoTopic of Object.keys(PAGES[strCurrentPage].content)){
        // בכול קטגוריה, עובר על כול המתכונים ומחפש התאמה לחיפוש
        for (let videoSubTopic of Object.keys(PAGES[strCurrentPage].content[videoTopic])) {
            for (let video of Object.keys(PAGES[strCurrentPage].content[videoTopic][videoSubTopic])) {
                let strUserInput = document.querySelector(`.searchBox`).value;
                if(addSpace(video).includes(strUserInput) && strUserInput !== ""){
                    let dropDownItem = El("a", {attributes: {href: `https://www.youtube.com/watch?v=${PAGES[strCurrentPage].content[videoTopic][videoSubTopic][video]}`}, classes : ["dropDownItem", videoSubTopic, video],}, addSpace(video))
                    document.querySelector('.dropDown').append(dropDownItem);
                }
            }
        }
    
    }
}

/* showNavBar
--------------------------------------------------------------
Description: change hyphen to space */
const showNavBar = () => {
    // מוחק מידע קודם ומכניס תפריט ניווט עליון לפי העמוד הנוכחי 
    document.querySelector(`.topNavBar`).innerHTML = "";
    for (key of Object.keys(PAGES[strCurrentPage].topNavBar)) {
        let navBarItem
        if (key.slice(0,3) === "img") {
            if (key.includes("button")) { // כפתור עליון שמאלי
                navBarItem = El(key.slice(0,3), 
                { attributes: { src: `../assets/images/grapics/topNavBar/${PAGES[strCurrentPage].topNavBar[key]}`, class: `${key.slice(4)} ${key.slice(11)}`},
                listeners: {click : showPage}});
                document.querySelector(`.topNavBar`).append(navBarItem);
            } else if (key === "img_SearchIcon") { // חיפוש
                navBarItem = El(key.slice(0,3), 
                { attributes: { src: `../assets/images/grapics/topNavBar/${PAGES[strCurrentPage].topNavBar[key]}`, class: key.slice(4)},
                listeners: {click : onClickSearch}});
                document.querySelector(`.topNavBar`).append(navBarItem);
            }else if (key === "img_home"){
                navBarItem = El(key.slice(0,3), 
                { attributes: { src: `../assets/images/grapics/topNavBar/${PAGES[strCurrentPage].topNavBar[key]}`, class: `${key.slice(4)} backToHome main`},
                listeners: {click : showPage}});
                document.querySelector(`.topNavBar`).append(navBarItem);
            }else { // סמלים
                navBarItem = El(key.slice(0,3), 
                { attributes: { src: `../assets/images/grapics/topNavBar/${PAGES[strCurrentPage].topNavBar[key]}`, class: key.slice(4)}});
                document.querySelector(`.topNavBar`).append(navBarItem);
            }
        } else if (key.slice(0,3) === "div"){ // כותרת
            if(key.slice(4,14) === "topNavText") {
                navBarItem = El(key.slice(0,3), { classes: [key.slice(4,14), key.slice(15)], listeners : {click: showPage}}, PAGES[strCurrentPage].topNavBar[key]);
                document.querySelector(`.topNavBar`).append(navBarItem);
            } else {
                navBarItem = El(key.slice(0,3), { cls: key.slice(4)}, PAGES[strCurrentPage].topNavBar[key]);
                document.querySelector(`.topNavBar`).append(navBarItem);
            }
        } else { // צבע רקע
            document.querySelector(`.topNavBar`).style[key] = PAGES[strCurrentPage].topNavBar[key];
        }
    }
}


const checkSwipeDirection = (event) => {
    if(event.detail.dir === "right" || event.detail.dir === "left"){
        showTopics(event)
    }
}

/* addSpace
--------------------------------------------------------------
Description: change hyphen to space */
const addSpace = (phrase) => {
    return phrase.replace(/-/g, ' ');
}

/* credits
--------------------------------------------------------------
Description: change hyphen to space */
const credits = () => {
    document.querySelector(`#contactUs`).classList.remove("hidden");
    document.querySelector(`#contactUs`).addEventListener("click", () => {
        document.querySelector(`#contactUs`).classList.add("hidden");
    });
}


//   @template T
//   @param {keyof HTMLElementTagNameMap} tagName 
//   @param {{classes?: string[], cls?: string, id?: string, attributes: {[index: string]: string | { toString(): string }}, listeners: Listeners}} options 
//   @param  {...string | Node} children 
function El(tagName, options = {}, ...children) {
    let el = Object.assign(document.createElement(tagName), options.fields || {});
    if (options.classes && options.classes.length) el.classList.add(...options.classes);
    else if (options.cls) el.classList.add(options.cls);
    if (options.id) el.id = options.id;
    el.append(...children.filter(el => el));
    for (let listenerName of Object.keys(options.listeners || {}))
        if (options.listeners[listenerName]) el.addEventListener(listenerName, options.listeners[listenerName], false);
    for (let attributeName of Object.keys(options.attributes || {})) {
        if (options.attributes[attributeName] !== undefined) el.setAttribute(attributeName, options.attributes[attributeName]);
    }
    return el;
}


// embed youtube video
// El("div",
//     {classes: [`youtubeVideoContainer`, key],},
//     El("iframe", {attributes:
//         {class: "youtubeVideo",
//         src: `https://www.youtube.com/embed/${PAGES[strCurrentPage].content[strCurrentTopic_videosPage][videoTopic][key]}`,
//         allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
//         allowfullscreen: true,
//     }}),
//     El("div", {cls: `videosDisplayText`}, addSpace(key))
// );https://github.com/madortill/recipeBook