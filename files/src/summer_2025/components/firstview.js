export const firstviewTextChange = () => {
    if (window.innerWidth > 1023) {
        document.querySelector('#firstview h1').innerHTML =
            '<span><b>プログラミング</b>に</span><br><span>ハマったら</span><br><span>夏休みが足りなくなりました</span>';
    }
};
