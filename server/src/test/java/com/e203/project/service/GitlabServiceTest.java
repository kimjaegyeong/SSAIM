package com.e203.project.service;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.e203.project.dto.gitlabapi.GitlabMR;

@SpringBootTest
public class GitlabServiceTest {
	@Autowired
	private GitlabService gitlabService;

	@Test
	public void gitAllMR() {
		List<GitlabMR> allMR = gitlabService.getAllMR("2024-11-03T23:59:59Z", "2024-11-05T23:59:59Z", "821395",
			"ZAzUAjNW-iihg1iTXHRr");
		for(GitlabMR mr : allMR) {
			System.out.println("mr : "+mr);
		}


	}

	@Test
	public void findUserMR(){
		List<String> userMR = gitlabService.findUserMR("2024-11-03T23:59:59Z","2024-11-05T23:59:59Z", 1,
			1);
		userMR.forEach(System.out::println);
	}
}
