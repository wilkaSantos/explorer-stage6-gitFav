import { GitApp } from "./git.js";

class Favorites{

    constructor(root){
        this.root = document.querySelector(root);
        this.load();
    }

    async add(userName){
        try {
            document.querySelector('#userGitField').value = '';
            
            const userExists = this.usersData.find(data => data.login === userName);

            if(userExists){
                throw new Error('Usuário já cadastrado, favor verificar.');
            }

            const user = await GitApp.search(userName);

            if(user.login === undefined){
                throw new Error(`Usuário não encontrado, favor verificar.`); 
            }

            if(user.login.length < 6){
                throw new Error(`Usuário não encontrado, favor verificar.`);
                
            }
            console.log(`${user.login.length} comprimento`);

            this.usersData = [user, ...this.usersData];
            this.update();
            this.save();
            location.reload();

        } catch (error) {
            alert(error);
        }
    }

    load(){
        const usersData = JSON.parse(localStorage.getItem('@github-favorites:')) || [];
        this.usersData = usersData;
    }

    save(){
        localStorage.setItem('@github-favorites:', JSON.stringify(this.usersData));
    }

    delete(user){
        const filterData = this.usersData.filter(data => data.login !== user.login);
        this.usersData = filterData;
        this.save();
        location.reload();
    }
}

export class FavoriteUsersView extends Favorites{
    
    constructor(root){
        super(root);

        const tbody = this.root.querySelector('.bottom');
        this.tbody = tbody;

        this.update();
        this.findUser();
    }

    update(){
        this.usersData.forEach(element => {
            const row = this.createRow();

            row.querySelector('.user img').src=`https://github.com/${element.login}.png`;
            row.querySelector('.user img').alt=`Imagem do usuário ${element.name}`;
            row.querySelector('.user a').href =`https://github.com/${element.login}`;
            row.querySelector('.user span').textContent = element.name;
            row.querySelector('.repositores').textContent = element.public_repos ;
            row.querySelector('.followers').textContent = element.followers;
            
            row.querySelector('.delete').onclick = ()=>{
                const isDelete = confirm(`Deseja excluir este registro?`);
                if(isDelete){
                    this.delete(element);
                }
            };
            this.tbody.append(row);
        });

    }

    createRow(){
        const tr = document.createElement('tr');

        const data = `
            <td class="user">
            <a href="" target="_blank">
                <img src="https://github.com/wilkaSantos.png" alt="Imagem foto usuário github">
                <span>wilkaSantos</span>
            </a>
            </td>
            <td class="repositores">10</td>
            <td class="followers">101</td>
            <td class="delete"><button class="removeButton">Remover</button></td>
        `;
        
        tr.innerHTML = data;
        return tr;
    }

    findUser(){
        const userAddButton = this.root.querySelector('.favButton');

        userAddButton.onclick = () =>{
            const { value } = this.root.querySelector('#userGitField');

            this.add(value);
        };
    }

    remove(){
        this.tbody.querySelectorAll('tr').forEach((tr)=>{
            tr.remove();
        });
    }
}