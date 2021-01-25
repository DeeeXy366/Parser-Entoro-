const button = document.getElementById('send');
const input = document.getElementById('count');
button.onclick = addButtons;

function generateDoc(number) {
    const body = JSON.stringify({
        data: number
    });
    fetch('/generateData',
        {
            method: 'POST',
            body: body
        })
}

function addButtons() {
    let buttons = document.getElementById('buttonsDiv');
    if(buttons !== null) {
        buttons.remove();
    }

    const body = JSON.stringify({
        data: input.value
    });
    fetch('/puppeteer',
        {
            method: 'POST',
            body: body
        })
        .then((res) => {
            return res.json();
        }).then((res) => {
            let elementId = document.getElementById('send');
            let div = document.createElement('div');
            div.setAttribute('id', 'buttonsDiv');
            insertAfter(elementId, div);

            elementId = document.getElementById('buttonsDiv');
            elementId.setAttribute('class', 'generatedButtonDiv');
            elementId.innerHTML = '<p id=\'forButtons\' ></p>';
            elementId = document.getElementById('forButtons');

            res.forEach(function (m) {
                let buttonsDiv = document.createElement('button');
                buttonsDiv.setAttribute('id', m);
                // buttonsDiv.setAttribute('onclick', 'generateDoc(' + m + ')');
                buttonsDiv.setAttribute('class', 'generatedButton');
                buttonsDiv.innerHTML = m;
                insertAfter(elementId, buttonsDiv);
                elementId = document.getElementById(m);
            })
           document.querySelectorAll('.generatedButton').forEach(
               item => {
                   item.addEventListener('click', () => {
                       generateDoc(123)
                   })
               }
           )
        });
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}